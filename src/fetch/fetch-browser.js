const def = {
    fetch(input, init) {
        if (window) {
            return window.fetch(input, init);
        } else if (fetch) {
            return fetch(input, init);
        } else if (self) {
            return self.fetch(input, init);
        }
    },
};

export default def;

export const fetch = def.fetch;
