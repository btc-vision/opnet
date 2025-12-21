// Browser shim for vm module - stub for asn1.js compatibility

export function runInThisContext(code) {
    return eval(code);
}

export function createContext() {
    return {};
}

export function runInContext(code, context) {
    return eval(code);
}

export default {
    runInThisContext,
    createContext,
    runInContext,
};
