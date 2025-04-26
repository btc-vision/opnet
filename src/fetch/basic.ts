import { Blob } from 'buffer';
import net from 'node:net';
import tls from 'node:tls';
import { URL } from 'node:url';
import { FormData, Headers, RequestInfo, Response, ResponseType } from 'undici';

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
        // A quick way to clone a Buffer into an ArrayBuffer
        return Promise.resolve(
            this.getBodyBuffer().buffer.slice(
                this.getBodyBuffer().byteOffset,
                this.getBodyBuffer().byteOffset + this.getBodyBuffer().byteLength,
            ) as ArrayBuffer,
        );
    }

    blob(): Promise<Blob> {
        // Using the built-in Blob from 'buffer' in Node 18+
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
 *
 * @param rawBody The portion of the response after headers
 * @returns Buffer of the unchunked body
 */
function parseChunkedBody(rawBody: string): Buffer {
    // In a chunked response, each chunk:
    //   1) starts with "<hex chunk-size>\r\n"
    //   2) followed by that many bytes
    //   3) then a "\r\n"
    //   repeated until chunk-size is 0
    //
    // This is a naive approach (e.g., ignoring trailer headers).
    const resultBuffers: Buffer[] = [];
    let current = rawBody;

    while (true) {
        // Find the first \r\n => chunk-size line
        const crlfIndex = current.indexOf('\r\n');
        if (crlfIndex === -1) break;

        // Parse chunk size
        const chunkSizeHex = current.slice(0, crlfIndex).trim();
        const chunkSize = parseInt(chunkSizeHex, 16);
        if (Number.isNaN(chunkSize)) {
            break; // Malformed or unexpected
        }
        if (chunkSize === 0) {
            // End of chunked data
            break;
        }

        const chunkStart = crlfIndex + 2;
        const chunkEnd = chunkStart + chunkSize;
        if (chunkEnd > current.length) {
            // The chunk claims more bytes than we have => incomplete
            break;
        }

        const chunkData = current.slice(chunkStart, chunkEnd);
        resultBuffers.push(Buffer.from(chunkData, 'utf-8'));

        // Move to after this chunk’s data + \r\n
        current = current.slice(chunkEnd + 2);
    }

    return Buffer.concat(resultBuffers);
}

/**
 * Parse the raw HTTP response into:
 *  - status
 *  - statusText
 *  - Headers
 *  - body Buffer
 */
function parseRawHttpResponse(raw: Buffer): {
    status: number;
    statusText: string;
    headers: Headers;
    body: Buffer;
} {
    // Convert to string for easy splitting
    const asString = raw.toString('latin1'); // or 'utf8', but 'latin1' is safer for raw bytes
    const doubleCrlfIndex = asString.indexOf('\r\n\r\n');

    // If we never found a double CRLF, we can’t parse properly
    if (doubleCrlfIndex < 0) {
        throw new Error('Malformed response (no header-body separator found)');
    }

    // Separate headers section from body section
    const headerSection = asString.slice(0, doubleCrlfIndex);
    const bodySection = asString.slice(doubleCrlfIndex + 4);

    // Split header lines
    const headerLines = headerSection.split('\r\n');

    // First line: "HTTP/1.1 200 OK"
    const [httpVersion, statusCode, ...rest] = headerLines[0].split(' ');
    const status = parseInt(statusCode, 10);
    const statusText = rest.join(' ').trim();

    // The rest are actual headers
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

    // Handle chunked transfer-encoding
    const transferEncoding = headers.get('transfer-encoding')?.toLowerCase();
    const contentLength = headers.get('content-length');

    let bodyBuffer: Buffer;
    if (transferEncoding === 'chunked') {
        bodyBuffer = parseChunkedBody(bodySection);
    } else if (contentLength) {
        // If we have a content-length, we can slice out the exact bytes
        const expectedLength = parseInt(contentLength, 10);
        bodyBuffer = Buffer.from(bodySection, 'latin1').subarray(0, expectedLength);
    } else {
        // If we have neither chunked nor content-length, we take whatever remains
        bodyBuffer = Buffer.from(bodySection, 'latin1');
    }

    return {
        status: status || 0,
        statusText: statusText || '',
        headers,
        body: bodyBuffer,
    };
}

/**
 * Supported options for our basic fetch implementation
 */
export interface BasicFetchOptions {
    method?: string;
    headers?: Record<string, string>;
    body?: string | Buffer | null;
}

/**
 * A basic implementation of fetch using Node's net/tls modules directly.
 * Creates a new TCP/TLS connection on every request.
 *
 * @param url - The URL to request.
 * @param options - Optional parameters for method, headers, and body.
 * @returns A promise that resolves to a BasicFetchResponse.
 */
export function fetchTest(url: RequestInfo, options: BasicFetchOptions = {}): Promise<Response> {
    return new Promise((resolve, reject) => {
        const { method = 'GET', headers = {}, body = null } = options;

        try {
            const urlObj = new URL(url);
            const isHttps = urlObj.protocol === 'https:';
            const port = urlObj.port ? parseInt(urlObj.port, 10) : isHttps ? 443 : 80;

            // Build the path (e.g. /path?query)
            const path = urlObj.pathname + urlObj.search;

            // If there's a body and user hasn't set Content-Length, set it automatically
            if (body && !headers['Content-Length']) {
                if (typeof body === 'string') {
                    headers['Content-Length'] = Buffer.byteLength(body).toString();
                } else if (Buffer.isBuffer(body)) {
                    headers['Content-Length'] = body.length.toString();
                }
            }

            // Build the raw HTTP request (method/path/version, headers, then body)
            // Example:
            //   GET / HTTP/1.1
            //   Host: example.com
            //   Connection: close
            //   Content-Length: ...
            //   (any other headers)
            //
            //   (possible body)
            const requestLines: string[] = [];
            requestLines.push(`${method.toUpperCase()} ${path} HTTP/1.1`);
            // Always set a Host header
            requestLines.push(`Host: ${urlObj.hostname}`);

            // We’ll explicitly close the connection each time (no keep-alive)
            requestLines.push('Connection: close');

            // Apply user-supplied headers
            for (const [key, val] of Object.entries(headers)) {
                if (key.toLowerCase() === 'connection') {
                    // Don't override the connection header
                    continue;
                }

                requestLines.push(`${key}: ${val}`);
            }

            requestLines.push(''); // end of headers
            let requestString = requestLines.join('\r\n');

            // If body is a string, we can append it after a final blank line.
            // If body is a buffer, we’ll write it separately after the string.
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

            // Create the socket (TLS if https, otherwise net)
            let socket: net.Socket | tls.TLSSocket;
            if (isHttps) {
                socket = tls.connect({ port, host: urlObj.hostname }, () => {
                    void onSocketConnect(socket);
                });
            } else {
                socket = net.connect({ port, host: urlObj.hostname }, () => {
                    void onSocketConnect(socket);
                });
            }

            // If something goes wrong establishing the socket
            socket.on('error', (err) => {
                reject(err as Error);
            });

            function writeWithPromise(
                sock: net.Socket | tls.TLSSocket,
                data: Buffer,
            ): Promise<void> {
                return new Promise((resolve, reject) => {
                    sock.write(data, (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
                });
            }

            function endWithPromise(sock: net.Socket | tls.TLSSocket, data: Buffer): Promise<void> {
                return new Promise((resolve, reject) => {
                    sock.end(data, () => {
                        resolve();
                    });
                });
            }

            const date = Date.now();

            async function onSocketConnect(sock: net.Socket | tls.TLSSocket) {
                console.log(`socket open after ${Date.now() - date} ms`);

                // Write the initial request lines
                await writeWithPromise(sock, rawRequest);

                // If there's a separate buffer for the body, write it here
                if (requestBuffer) {
                    await writeWithPromise(sock, requestBuffer);
                }

                // Then signal we’re done sending the request
                //await endWithPromise(sock, Buffer.alloc(0));
            }

            // Read all data from the socket into chunks
            const responseChunks: Buffer[] = [];

            socket.on('data', (chunk: Buffer) => {
                responseChunks.push(chunk);
            });

            // Once the server closes the connection, parse what we got
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
        } catch (error) {
            reject(error as Error);
        }
    });
}
