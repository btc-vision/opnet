/**
 * Shared types for JSON threader implementations.
 *
 * @packageDocumentation
 */

export type JsonValue =
    | string
    | number
    | boolean
    | null
    | JsonValue[]
    | { [key: string]: JsonValue };

export interface FetchRequest {
    url: string;
    payload: JsonValue;
    timeout?: number;
    headers?: Record<string, string>;
}

/**
 * Common interface for all JSON threader implementations.
 */
export interface IJsonThreader {
    readonly stats: {
        pending: number;
        queued: number;
        available: number;
        total: number;
        processed: number;
        failed: number;
    };
    parse<T = JsonValue>(json: string): Promise<T>;
    parseBuffer<T = JsonValue>(buffer: ArrayBuffer): Promise<T>;
    stringify(data: JsonValue): Promise<string>;
    fetch<T = JsonValue>(request: FetchRequest): Promise<T>;
    terminate(): Promise<void>;
}
