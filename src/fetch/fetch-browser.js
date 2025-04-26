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

export function getFetcher() {
    return {
        fetch(input, init) {
            return originalFetch(input, init);
        },
    };
}

export default getFetcher;
