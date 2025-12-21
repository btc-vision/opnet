// Browser shim for undici - uses native fetch API
// Must be self-contained with no external imports to avoid circular deps

export class Agent {
    async close() {}
}

export function fetch(input, init) {
    const nativeFetch = globalThis.fetch || window.fetch || self.fetch;
    if (!nativeFetch) {
        throw new Error('Fetch API is not available.');
    }
    return nativeFetch(input, init);
}

export function setGlobalDispatcher() {}

export default { fetch, setGlobalDispatcher, Agent };
