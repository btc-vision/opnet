import { Network } from '@btc-vision/bitcoin';
import { Address, ChallengeSolution, IP2WSHAddress } from '@btc-vision/transaction';
import { UTXO, UTXOs } from '../../bitcoin/UTXOs.js';
import { BroadcastedTransaction } from '../../transactions/interfaces/BroadcastedTransaction.js';
import { RequestUTXOsParamsWithAmount } from '../../utxos/interfaces/IUTXOsManager.js';

/**
 * Interface for the minimal provider functionality needed by CallResult.
 * This breaks the circular dependency between CallResult and AbstractRpcProvider.
 */
export interface IUTXOManagerForCallResult {
    getUTXOsForAmount(params: RequestUTXOsParamsWithAmount): Promise<UTXO[]>;
    spentUTXO(address: string, spent: UTXOs, newUTXOs: UTXOs): void;
    clean(): void;
}

export interface IProviderForCallResult {
    readonly network: Network;
    readonly utxoManager: IUTXOManagerForCallResult;

    getChallenge(): Promise<ChallengeSolution>;
    sendRawTransaction(tx: string, psbt: boolean): Promise<BroadcastedTransaction>;
    getCSV1ForAddress(address: Address): IP2WSHAddress;
}
