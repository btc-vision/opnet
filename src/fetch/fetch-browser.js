export default {
    fetch(input, init) {
        return window.fetch(input, init);
    },
};

export const fetch = window.fetch;
