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

export * from './interfaces/opnet/OPNetTransactionTypes.js';
export * from './interfaces/transactions/ITransaction.js';
export * from './transactions/DeploymentTransaction.js';
export * from './transactions/GenericTransaction.js';
export * from './transactions/InteractionTransaction.js';
export * from './transactions/Transaction.js';
export * from './transactions/TransactionInput.js';
export * from './transactions/TransactionOutput.js';
export * from './providers/JSONRpcProvider.js';

export * from './block/Block.js';
export * from './interfaces/blocks/IBlock.js';

export default {
    version: '0.0.1',
};
