const originalFetch =
    typeof fetch === 'function'
        ? fetch
        : typeof window !== 'undefined' && typeof window.fetch === 'function'
          ? window.fetch
          : typeof self !== 'undefined' && typeof self.fetch === 'function'
            ? self.fetch
            : undefined;

if (!originalFetch) {
    throw new Error('Fetch API is not available.');
}

export class Agent {}

const def = {
    fetch(input, init) {
        return originalFetch(input, init);
    },
    setGlobalDispatcher: () => {},
    Agent,
};

export default def;
export const fetch = def.fetch;
export const setGlobalDispatcher = def.setGlobalDispatcher;
