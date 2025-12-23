import { Address } from '@btc-vision/transaction';
import { OPNetTransactionTypes } from '../../../interfaces/opnet/OPNetTransactionTypes.js';
import { ITransactionBase } from '../ITransactionBase.js';
import { ProofOfWorkChallenge } from '../ProofOfWorkChallenge.js';

export interface ICommonTransaction<T extends OPNetTransactionTypes> extends ITransactionBase<T> {
    /**
     * @description The p2op contract address. (SAFE)
     */
    readonly contractAddress?: string;

    /**
     * @description The contract tweaked public key.
     */
    readonly contractPublicKey?: Address | string;

    /**
     * @description This indicates who sent the transaction.
     */
    readonly from?: Address | string;

    /**
     * @description This indicates who sent the transaction.
     */
    readonly fromLegacy?: Address | string;

    /**
     * @description Was the binary data compressed?
     */
    readonly wasCompressed?: boolean;

    /**
     * @description The proof of work challenge.
     */
    readonly pow?: ProofOfWorkChallenge;
}
