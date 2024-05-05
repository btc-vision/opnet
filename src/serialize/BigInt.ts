export {};

declare global {
    interface BigInt {
        /**
         * Returns the JSON representation of the BigInt instance.
         * @returns The JSON representation of the BigInt instance as a string.
         */
        toJSON(): string;
    }
}

BigInt.prototype.toJSON = function () {
    return this.toString();
};
