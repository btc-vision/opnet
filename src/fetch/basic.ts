import { Blob } from 'buffer';
import { promises as dnsPromises } from 'node:dns'; // <-- DNS Promises API
import net from 'node:net';
import tls from 'node:tls';
import { URL } from 'node:url';
import { FormData, Headers, RequestInfo, Response, ResponseType } from 'undici';

// Keep a cache from hostname => { address, expiresAt }
const dnsCache = new Map<string, { address: Promise<string>; expiresAt: number }>();

async function dnsAddress(host: string): Promise<string> {
    const lookupResult = await dnsPromises.lookup(host);
    let address = lookupResult.address;

    if (address === '::1') {
        address = '127.0.0.1';
    }

    return address;
}

/**
 * Resolve a hostname to an IP address, using an in-memory cache.
 * Here we set a fixed TTL of e.g. 60,000 ms (60 seconds).
 */
async function resolveHostnameWithCache(host: string): Promise<string> {
    // Check cache
    const cached = dnsCache.get(host);
    const now = Date.now();
    if (cached && cached.expiresAt > now) {
        console.log(`Using cached IP for ${host}: ${cached.address}`);

        // If still valid, return cached IP
        return await cached.address;
    }

    const address = dnsAddress(host);
    // Store it in cache for 60 seconds
    const ttlMs = 60000;
    dnsCache.set(host, { address, expiresAt: now + ttlMs });

    return await address;
}

/**
 * A minimal subset of the Fetch API's response interface
 */
class BasicFetchResponse {
    body: null = null;
    bodyUsed: boolean = false;
    headers: Headers;
    ok: boolean;
    redirected: boolean = false;
    status: number;
    statusText: string;
    type: ResponseType = 'basic';
    url: string;
    private _bodyBuffer: Buffer | null = null;

    constructor(
        bodyBuffer: Buffer,
        status: number,
        statusText: string,
        headers: Headers,
        url: string,
    ) {
        this.status = status;
        this.statusText = statusText;
        this.ok = status >= 200 && status < 300;
        this.headers = headers;
        this.url = url;
    }

    text(): Promise<string> {
        return Promise.resolve(this.toString());
    }

    json<T = unknown>(): Promise<T> {
        return Promise.resolve(JSON.parse(this.toString()) as T);
    }

    arrayBuffer(): Promise<ArrayBuffer> {
        return Promise.resolve(
            this.getBodyBuffer().buffer.slice(
                this.getBodyBuffer().byteOffset,
                this.getBodyBuffer().byteOffset + this.getBodyBuffer().byteLength,
            ) as ArrayBuffer,
        );
    }

    blob(): Promise<Blob> {
        return Promise.resolve(new Blob([this.getBodyBuffer()]));
    }

    formData(): Promise<FormData> {
        throw new Error('formData not implemented in this minimal example.');
    }

    clone(): Response {
        throw new Error('clone not implemented in this minimal example.');
    }

    setBodyBuffer(buf: Buffer) {
        this._bodyBuffer = buf;
    }

    getBodyBuffer(): Buffer {
        return this._bodyBuffer ?? Buffer.alloc(0);
    }

    toString(): string {
        return this.getBodyBuffer().toString('utf-8');
    }
}

/**
 * Minimal chunked transfer-encoding support
 */
function parseChunkedBody(rawBody: string): Buffer {
    const resultBuffers: Buffer[] = [];
    let current = rawBody;

    while (true) {
        const crlfIndex = current.indexOf('\r\n');
        if (crlfIndex === -1) break;

        const chunkSizeHex = current.slice(0, crlfIndex).trim();
        const chunkSize = parseInt(chunkSizeHex, 16);
        if (Number.isNaN(chunkSize)) {
            break;
        }
        if (chunkSize === 0) {
            break;
        }

        const chunkStart = crlfIndex + 2;
        const chunkEnd = chunkStart + chunkSize;
        if (chunkEnd > current.length) {
            break;
        }

        const chunkData = current.slice(chunkStart, chunkEnd);
        resultBuffers.push(Buffer.from(chunkData, 'utf-8'));

        current = current.slice(chunkEnd + 2);
    }

    return Buffer.concat(resultBuffers);
}

/**
 * Parse the raw HTTP response
 */
function parseRawHttpResponse(raw: Buffer): {
    status: number;
    statusText: string;
    headers: Headers;
    body: Buffer;
} {
    const asString = raw.toString('latin1');
    const doubleCrlfIndex = asString.indexOf('\r\n\r\n');

    if (doubleCrlfIndex < 0) {
        throw new Error('Malformed response (no header-body separator found)');
    }

    const headerSection = asString.slice(0, doubleCrlfIndex);
    const bodySection = asString.slice(doubleCrlfIndex + 4);

    const headerLines = headerSection.split('\r\n');

    // e.g. "HTTP/1.1 200 OK"
    const [httpVersion, statusCode, ...rest] = headerLines[0].split(' ');
    const status = parseInt(statusCode, 10);
    const statusText = rest.join(' ').trim();

    const headers = new Headers();
    for (let i = 1; i < headerLines.length; i++) {
        const line = headerLines[i];
        const sep = line.indexOf(':');
        if (sep > -1) {
            const key = line.slice(0, sep).trim();
            const val = line.slice(sep + 1).trim();
            headers.set(key, val);
        }
    }

    const transferEncoding = headers.get('transfer-encoding')?.toLowerCase();
    const contentLength = headers.get('content-length');

    let bodyBuffer: Buffer;
    if (transferEncoding === 'chunked') {
        bodyBuffer = parseChunkedBody(bodySection);
    } else if (contentLength) {
        const expectedLength = parseInt(contentLength, 10);
        bodyBuffer = Buffer.from(bodySection, 'latin1').subarray(0, expectedLength);
    } else {
        bodyBuffer = Buffer.from(bodySection, 'latin1');
    }

    return {
        status: status || 0,
        statusText: statusText || '',
        headers,
        body: bodyBuffer,
    };
}

export interface BasicFetchOptions {
    method?: string;
    headers?: Record<string, string>;
    body?: string | Buffer | null;
}

/**
 * A basic implementation of fetch using Node's net/tls modules directly,
 * but now with a naive DNS cache to reduce lookup overhead.
 */
export async function fetchTest(
    url: RequestInfo,
    options: BasicFetchOptions = {},
): Promise<Response> {
    const { method = 'GET', headers = {}, body = null } = options;

    return new Promise<Response>(async (resolve, reject) => {
        try {
            const urlObj = new URL(url.toString());
            const isHttps = urlObj.protocol === 'https:';
            const defaultPort = isHttps ? 443 : 80;
            const port = urlObj.port ? parseInt(urlObj.port, 10) : defaultPort;

            const path = urlObj.pathname + urlObj.search;

            // If there's a body and user hasn't set Content-Length, set it
            if (body && !headers['Content-Length']) {
                if (typeof body === 'string') {
                    headers['Content-Length'] = Buffer.byteLength(body).toString();
                } else if (Buffer.isBuffer(body)) {
                    headers['Content-Length'] = body.length.toString();
                }
            }

            // Build raw HTTP request lines
            const requestLines: string[] = [];
            requestLines.push(`${method.toUpperCase()} ${path} HTTP/1.1`);
            // We always set the Host header to the original domain (not the resolved IP)
            requestLines.push(`Host: ${urlObj.hostname}`);
            requestLines.push('Connection: close');

            for (const [key, val] of Object.entries(headers)) {
                if (key.toLowerCase() === 'connection') {
                    continue;
                }
                requestLines.push(`${key}: ${val}`);
            }

            requestLines.push(''); // end of headers
            let requestString = requestLines.join('\r\n');

            let requestBuffer: Buffer | null = null;
            if (typeof body === 'string') {
                requestString += `\r\n${body}`;
            } else {
                requestString += '\r\n';
                if (Buffer.isBuffer(body)) {
                    requestBuffer = body;
                }
            }

            const rawRequest = Buffer.from(requestString, 'utf-8');

            // Resolve hostname to IP (using our naive cache)
            const ip = await resolveHostnameWithCache(urlObj.hostname);

            // Create the socket
            let socket: net.Socket | tls.TLSSocket;
            const connectOptions = { port, host: ip };

            const startTime = Date.now();

            process.nextTick(() => {
                if (isHttps) {
                    socket = tls.connect(connectOptions, () => {
                        console.log(`socket open after ${Date.now() - startTime} ms`);
                        void onSocketConnect(socket);
                    });
                } else {
                    socket = net.connect(connectOptions, () => {
                        console.log(`socket open after ${Date.now() - startTime} ms`);
                        void onSocketConnect(socket);
                    });
                }

                socket.on('error', (err) => {
                    reject(err as Error);
                });

                async function onSocketConnect(sock: net.Socket | tls.TLSSocket) {
                    // Send the initial request
                    await writeWithPromise(sock, rawRequest);

                    if (requestBuffer) {
                        await writeWithPromise(sock, requestBuffer);
                    }

                    // End the request
                    //sock.end();
                }

                function writeWithPromise(
                    sock: net.Socket | tls.TLSSocket,
                    data: Buffer,
                ): Promise<void> {
                    return new Promise((resolve, reject) => {
                        sock.write(data, (err) => {
                            if (err) reject(err);
                            else resolve();
                        });
                    });
                }

                const responseChunks: Buffer[] = [];
                socket.on('data', (chunk: Buffer) => {
                    responseChunks.push(chunk);
                });

                socket.on('end', () => {
                    try {
                        const fullResponse = Buffer.concat(responseChunks);
                        const {
                            status,
                            statusText,
                            headers: responseHeaders,
                            body: responseBody,
                        } = parseRawHttpResponse(fullResponse);

                        const response = new BasicFetchResponse(
                            responseBody,
                            status,
                            statusText,
                            responseHeaders,
                            urlObj.toString(),
                        );
                        response.setBodyBuffer(responseBody);

                        resolve(response as Response);
                    } catch (parseErr) {
                        reject(parseErr as Error);
                    }
                });
            });
        } catch (error) {
            reject(error as Error);
        }
    });
}
