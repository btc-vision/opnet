import { Network } from '@btc-vision/bitcoin';
import {
    Address,
    AddressTypes,
    AddressVerificator,
    BufferHelper,
    ChallengeSolution,
    RawChallenge,
} from '@btc-vision/transaction';
import '../serialize/BigInt.js';

import { Block } from '../block/Block.js';
import { BlockGasParameters, IBlockGasParametersInput } from '../block/BlockGasParameters.js';
import { parseBlockWitnesses } from '../block/BlockWitness.js';
import { IBlock } from '../block/interfaces/IBlock.js';
import { BlockWitnesses, RawBlockWitnessAPI } from '../block/interfaces/IBlockWitness.js';
import { BigNumberish, BlockTag } from '../common/CommonTypes.js';
import { CallResult } from '../contracts/CallResult.js';
import { ContractData } from '../contracts/ContractData.js';
import { TransactionOutputFlags } from '../contracts/enums/TransactionFlags.js';
import { IAccessList } from '../contracts/interfaces/IAccessList.js';
import { ICallRequestError, ICallResult } from '../contracts/interfaces/ICallResult.js';
import { IRawContract } from '../contracts/interfaces/IRawContract.js';
import {
    ParsedSimulatedTransaction,
    SimulatedTransaction,
} from '../contracts/interfaces/SimulatedTransaction.js';
import { Epoch } from '../epoch/Epoch.js';
import { EpochWithSubmissions } from '../epoch/EpochSubmission.js';
import { EpochTemplate } from '../epoch/EpochTemplate.js';
import { EpochSubmissionParams } from '../epoch/interfaces/EpochSubmissionParams.js';
import {
    RawEpoch,
    RawEpochTemplate,
    RawEpochWithSubmissions,
    RawSubmittedEpoch,
} from '../epoch/interfaces/IEpoch.js';
import { SubmittedEpoch } from '../epoch/SubmittedEpoch.js';
import { OPNetTransactionTypes } from '../interfaces/opnet/OPNetTransactionTypes.js';
import { IStorageValue } from '../storage/interfaces/IStorageValue.js';
import { StoredValue } from '../storage/StoredValue.js';
import { BroadcastedTransaction } from '../transactions/interfaces/BroadcastedTransaction.js';
import { ITransaction } from '../transactions/interfaces/ITransaction.js';
import { ITransactionReceipt } from '../transactions/interfaces/ITransactionReceipt.js';
import { TransactionReceipt } from '../transactions/metadata/TransactionReceipt.js';
import { TransactionBase } from '../transactions/Transaction.js';
import { TransactionParser } from '../transactions/TransactionParser.js';
import { UTXOsManager } from '../utxos/UTXOsManager.js';
import { JsonRpcPayload } from './interfaces/JSONRpc.js';
import { JSONRpcMethods } from './interfaces/JSONRpcMethods.js';
import {
    JSONRpc2ResponseResult,
    JsonRpcCallResult,
    JsonRpcError,
    JsonRpcResult,
    JSONRpcResultError,
} from './interfaces/JSONRpcResult.js';
import { AddressesInfo, IPublicKeyInfoResult } from './interfaces/PublicKeyInfo.js';
import { ReorgInformation } from './interfaces/ReorgInformation.js';

interface ChallengeCache {
    readonly challenge: ChallengeSolution;
    readonly expireAt: number;
}

/**
 * @description This class is used to provide an abstract RPC provider.
 * @abstract
 * @class AbstractRpcProvider
 * @category Providers
 */
export abstract class AbstractRpcProvider {
    private nextId: number = 0;
    private chainId: bigint | undefined;
    private gasCache: BlockGasParameters | undefined;
    private lastFetchedGas: number = 0;

    private challengeCache: ChallengeCache | undefined;

    protected constructor(public readonly network: Network) {}

    private _utxoManager: UTXOsManager = new UTXOsManager(this);

    /**
     * Get the UTXO manager.
     */
    public get utxoManager(): UTXOsManager {
        return this._utxoManager;
    }

    /**
     * Get the public key information.
     * @description This method is used to get the public key information.
     * @param {string} address The address or addresses to get the public key information of
     * @returns {Promise<Address>} The public keys information
     * @example await getPublicKeyInfo('bcrt1qfqsr3m7vjxheghcvw4ks0fryqxfq8qzjf8fxes');
     * @throws {Error} If the address is invalid
     */
    public async getPublicKeyInfo(address: string): Promise<Address> {
        try {
            const pubKeyInfo = await this.getPublicKeysInfo(address);

            return pubKeyInfo[address] || pubKeyInfo[address.replace('0x', '')];
        } catch (e) {
            if (AddressVerificator.isValidPublicKey(address, this.network)) {
                return Address.fromString(address);
            }

            throw e;
        }
    }

    /**
     * Verify an address.
     * @param {string | Address} addr The address to verify
     * @param {Network} network The network to verify the address against
     * @returns {AddressTypes} The address type, return null if the address is invalid
     */
    public validateAddress(addr: string | Address, network: Network): AddressTypes | null {
        let validationResult: AddressTypes | null = null;

        if (addr instanceof Address) {
            validationResult = AddressVerificator.detectAddressType(addr.toHex(), network);
        } else if (typeof addr === 'string') {
            validationResult = AddressVerificator.detectAddressType(addr, network);
        } else {
            throw new Error(`Invalid type: ${typeof addr} for address: ${addr}`);
        }

        return validationResult;
    }

    /**
     * Get the latest block number.
     * @description This method is used to get the latest block number.
     * @returns {Promise<number>} The latest block number
     * @example await getBlockNumber();
     */
    public async getBlockNumber(): Promise<bigint> {
        const payload: JsonRpcPayload = this.buildJsonRpcPayload(
            JSONRpcMethods.BLOCK_BY_NUMBER,
            [],
        );

        const rawBlockNumber: JsonRpcResult = await this.callPayloadSingle(payload);
        const result: string = rawBlockNumber.result as string;

        return BigInt(result);
    }

    /**
     * Get block by checksum.
     * @param {string} checksum The block checksum
     * @param {boolean} prefetchTxs Whether to prefetch transactions
     * @description This method is used to get a block by its checksum.
     * @returns {Promise<Block>} The requested block
     * @throws {Error} If the block is not found
     * @example await getBlockByChecksum('0xabcdef123456...');
     */
    public async getBlockByChecksum(
        checksum: string,
        prefetchTxs: boolean = false,
    ): Promise<Block> {
        const payload: JsonRpcPayload = this.buildJsonRpcPayload(
            JSONRpcMethods.GET_BLOCK_BY_CHECKSUM,
            [checksum, prefetchTxs],
        );

        const block: JsonRpcResult = await this.callPayloadSingle(payload);
        if ('error' in block) {
            throw new Error(
                `Error fetching block by checksum: ${block.error?.message || 'Unknown error'}`,
            );
        }

        const result: IBlock = block.result as IBlock;
        return new Block(result, this.network);
    }

    /**
     * Get the latest challenge to use in a transaction.
     * @description This method is used to get the latest challenge along with epoch winner and verification data.
     * @returns {Promise<ChallengeSolution>} The challenge and epoch data
     * @example const challenge = await getChallenge();
     * @throws {Error} If no challenge found or OPNet is not active
     */
    public async getChallenge(): Promise<ChallengeSolution> {
        // Check if we have a cached preimage that hasn't expired
        if (this.challengeCache && Date.now() < this.challengeCache.expireAt) {
            return this.challengeCache.challenge;
        }

        const payload: JsonRpcPayload = this.buildJsonRpcPayload(
            JSONRpcMethods.TRANSACTION_PREIMAGE,
            [],
        );

        const rawChallenge: JsonRpcResult = await this.callPayloadSingle(payload);
        if ('error' in rawChallenge) {
            throw new Error(
                `Error fetching preimage: ${rawChallenge.error?.message || 'Unknown error'}`,
            );
        }

        const result: RawChallenge = rawChallenge.result as RawChallenge;
        if (!result || !result.solution) {
            throw new Error(
                'No challenge found. OPNet is probably not active yet on this blockchain.',
            );
        }

        // Check if the solution is all zeros (invalid)
        const solutionHex = result.solution.replace('0x', '');
        if (solutionHex === '0'.repeat(64)) {
            throw new Error(
                'No valid challenge found. OPNet is probably not active yet on this blockchain.',
            );
        }

        const challengeSolution = new ChallengeSolution(result);
        this.challengeCache = {
            challenge: challengeSolution,
            expireAt: Date.now() + 10_000,
        };

        return challengeSolution;
    }

    /**
     * Get block by number or hash.
     * @param {BlockTag} blockNumberOrHash The block number or hash
     * @param {boolean} prefetchTxs Whether to prefetch transactions
     * @description This method is used to get a block by its number or hash.
     * @returns {Promise<Block>} The requested block
     * @throws {Error} If the block is not found
     * @example await getBlock(123456);
     */
    public async getBlock(
        blockNumberOrHash: BlockTag,
        prefetchTxs: boolean = false,
    ): Promise<Block> {
        const method =
            typeof blockNumberOrHash === 'string'
                ? JSONRpcMethods.GET_BLOCK_BY_HASH
                : JSONRpcMethods.GET_BLOCK_BY_NUMBER;

        const payload: JsonRpcPayload = this.buildJsonRpcPayload(method, [
            blockNumberOrHash,
            prefetchTxs,
        ]);

        const block: JsonRpcResult = await this.callPayloadSingle(payload);

        const result: IBlock = block.result as IBlock;
        return new Block(result, this.network);
    }

    /**
     * Get multiple blocks by number or hash.
     * @param {BlockTag[]} blockNumbers The block numbers or hashes
     * @param {boolean} prefetchTxs Whether to prefetch transactions
     * @description This method is used to get multiple blocks by their numbers or hashes.
     * @returns {Promise<Block[]>} The requested blocks
     */
    public async getBlocks(
        blockNumbers: BlockTag[],
        prefetchTxs: boolean = false,
    ): Promise<Block[]> {
        const payloads: JsonRpcPayload[] = blockNumbers.map((blockNumber) => {
            return this.buildJsonRpcPayload(JSONRpcMethods.GET_BLOCK_BY_NUMBER, [
                blockNumber,
                prefetchTxs,
            ]);
        });

        const blocks: JsonRpcCallResult = await this.callMultiplePayloads(payloads);
        if ('error' in blocks) {
            const error = blocks.error as JSONRpcResultError<JSONRpcMethods.BLOCK_BY_NUMBER>;

            throw new Error(`Error fetching block: ${error.message}`);
        }

        return blocks.map((block) => {
            if ('error' in block) {
                throw new Error(`Error fetching block: ${block.error}`);
            }

            const result: IBlock = block.result as IBlock;

            return new Block(result, this.network);
        });
    }

    /**
     * Get block by hash. This is the same method as getBlock.
     * @param {string} blockHash The block hash
     * @description This method is used to get a block by its hash. Note that this method is the same as getBlock.
     * @returns {Promise<Block>} The requested block
     * @throws {Error} If the block is not found
     */
    public async getBlockByHash(blockHash: string): Promise<Block> {
        return await this.getBlock(blockHash);
    }

    /**
     * Get the bitcoin balance of an address.
     * @param {string} addressLike The address to get the balance of
     * @param {boolean} filterOrdinals Whether to filter ordinals or not
     * @description This method is used to get the balance of a bitcoin address.
     * @returns {Promise<bigint>} The balance of the address
     * @example await getBalance('bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq');
     */
    public async getBalance(addressLike: string, filterOrdinals: boolean = true): Promise<bigint> {
        const address: string = addressLike.toString();
        const payload: JsonRpcPayload = this.buildJsonRpcPayload(JSONRpcMethods.GET_BALANCE, [
            address,
            filterOrdinals,
        ]);

        const rawBalance: JsonRpcResult = await this.callPayloadSingle(payload);
        const result: string = rawBalance.result as string;
        if (!result || (result && !result.startsWith('0x'))) {
            throw new Error(`Invalid balance returned from provider: ${result}`);
        }

        return BigInt(result);
    }

    /**
     * Get the bitcoin balances of multiple addresses.
     * @param {string[]} addressesLike The addresses to get the balances of
     * @param {boolean} filterOrdinals Whether to filter ordinals or not
     * @description This method is used to get the balance of a bitcoin address.
     * @returns {Record<string, bigint>} The balance of the address
     * @example await getBalances(['bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq']);
     */
    public async getBalances(
        addressesLike: string[],
        filterOrdinals: boolean = true,
    ): Promise<Record<string, bigint>> {
        const payloads: JsonRpcPayload[] = addressesLike.map((address: string) => {
            return this.buildJsonRpcPayload(JSONRpcMethods.GET_BALANCE, [address, filterOrdinals]);
        });

        const balances: JsonRpcCallResult = await this.callMultiplePayloads(payloads);
        if ('error' in balances) {
            const error = balances.error as JSONRpcResultError<JSONRpcMethods.GET_BALANCE>;

            throw new Error(`Error fetching block: ${error.message}`);
        }

        const resultBalance: Record<string, bigint> = {};
        for (let i = 0; i < balances.length; i++) {
            const balance = balances[i];
            const address = addressesLike[i];

            if (!address) throw new Error('Impossible index.');

            if ('error' in balance) {
                throw new Error(`Error fetching block: ${balance.error}`);
            }

            const result = balance.result as string;
            if (!result || (result && !result.startsWith('0x'))) {
                throw new Error(`Invalid balance returned from provider: ${result}`);
            }

            resultBalance[address] = BigInt(result);
        }

        return resultBalance;
    }

    /**
     * Get a transaction by its hash or hash id.
     * @description This method is used to get a transaction by its hash or hash id.
     * @param {string} txHash The transaction hash
     * @returns {Promise<TransactionBase<OPNetTransactionTypes>>} The requested transaction
     * @example await getTransaction('63e77ba9fa4262b3d4d0d9d97fa8a7359534606c3f3af096284662e3f619f374');
     * @throws {Error} If something went wrong while fetching the transaction
     */
    public async getTransaction(txHash: string): Promise<TransactionBase<OPNetTransactionTypes>> {
        const payload: JsonRpcPayload = this.buildJsonRpcPayload(
            JSONRpcMethods.GET_TRANSACTION_BY_HASH,
            [txHash],
        );

        const rawTransaction: JsonRpcResult = await this.callPayloadSingle(payload);
        const result: ITransaction = rawTransaction.result as ITransaction;

        if ('error' in rawTransaction) {
            throw new Error(
                `Error fetching transaction: ${rawTransaction.error?.message || 'Unknown error'}`,
            );
        }

        return TransactionParser.parseTransaction(result, this.network);
    }

    /**
     * Get a transaction receipt by its hash.
     * @description This method is used to get a transaction receipt by its hash.
     * @param {string} txHash The transaction hash
     * @returns {Promise<TransactionReceipt>} The requested transaction receipt
     * @example await getTransactionReceipt('63e77ba9fa4262b3d4d0d9d97fa8a7359534606c3f3af096284662e3f619f374');
     * @throws {Error} Something went wrong while fetching the transaction receipt
     */
    public async getTransactionReceipt(txHash: string): Promise<TransactionReceipt> {
        const payload: JsonRpcPayload = this.buildJsonRpcPayload(
            JSONRpcMethods.GET_TRANSACTION_RECEIPT,
            [txHash],
        );

        const rawTransaction: JsonRpcResult = await this.callPayloadSingle(payload);
        return new TransactionReceipt(rawTransaction.result as ITransactionReceipt, this.network);
    }

    /**
     * Get the current connected network type.
     * @description This method is used to get the current connected network type.
     * @returns {Network} The current connected network type
     * @throws {Error} If the chain id is invalid
     */
    public getNetwork(): Network {
        return this.network;
    }

    /**
     * Get the chain id.
     * @description This method is used to get the chain id.
     * @returns {Promise<bigint>} The chain id
     * @throws {Error} If something went wrong while fetching the chain id
     */
    public async getChainId(): Promise<bigint> {
        if (this.chainId !== undefined) return this.chainId;

        const payload: JsonRpcPayload = this.buildJsonRpcPayload(JSONRpcMethods.CHAIN_ID, []);
        const rawChainId: JsonRpcResult = await this.callPayloadSingle(payload);
        if ('error' in rawChainId) {
            throw new Error(`Something went wrong while fetching: ${rawChainId.error}`);
        }

        const chainId = rawChainId.result as string;
        this.chainId = BigInt(chainId);

        return this.chainId;
    }

    /**
     * Get the contract code of an address.
     * @description This method is used to get the contract code of an address.
     * @param {string | Address} address The address of the contract
     * @param {boolean} [onlyBytecode] Whether to return only the bytecode
     * @returns {Promise<ContractData | Buffer>} The contract data or bytecode
     * @example await getCode('tb1pth90usc4f528aqphpjrfkkdm4vy8hxnt5gps6aau2nva6pxeshtqqzlt3a');
     * @throws {Error} If something went wrong while fetching the contract code
     */
    public async getCode(
        address: string | Address,
        onlyBytecode: boolean = false,
    ): Promise<ContractData | Buffer> {
        const addressStr: string = address.toString();
        const payload: JsonRpcPayload = this.buildJsonRpcPayload(JSONRpcMethods.GET_CODE, [
            addressStr,
            onlyBytecode,
        ]);

        const rawCode: JsonRpcResult = await this.callPayloadSingle(payload);
        if (rawCode.error) {
            throw new Error(
                `${rawCode.error.code}: Something went wrong while fetching: ${rawCode.error.message}`,
            );
        }

        const result: IRawContract | { bytecode: string } = rawCode.result as
            | IRawContract
            | { bytecode: string };

        if ('contractAddress' in result) {
            return new ContractData(result);
        } else {
            return Buffer.from(result.bytecode, 'base64');
        }
    }

    /**
     * Get the storage at a specific address and pointer.
     * @description This method is used to get the storage at a specific address and pointer.
     * @param {string | Address} address The address to get the storage from
     * @param {BigNumberish} rawPointer The pointer to get the storage from as base64 or bigint
     * @param {boolean} proofs Whether to send proofs or not
     * @param {BigNumberish} [height] The height to get the storage from
     * @returns {Promise<StoredValue>} The storage value
     * @example await getStorageAt('tb1pth90usc4f528aqphpjrfkkdm4vy8hxnt5gps6aau2nva6pxeshtqqzlt3a', 'EXLK/QhEQMI5d9DrthLvozT+UcDQ7WuSPaz7g8GV3AQ=');
     * @throws {Error} If something went wrong while fetching the storage
     */
    public async getStorageAt(
        address: string | Address,
        rawPointer: bigint | string,
        proofs: boolean = true,
        height?: BigNumberish,
    ): Promise<StoredValue> {
        const addressStr: string = address.toString();
        const pointer: string =
            typeof rawPointer === 'string' ? rawPointer : this.bigintToBase64(rawPointer);

        const params: [string, string, boolean, string?] = [addressStr, pointer, proofs];

        if (height) {
            params.push(height.toString());
        }

        const payload: JsonRpcPayload = this.buildJsonRpcPayload(
            JSONRpcMethods.GET_STORAGE_AT,
            params,
        );
        const rawStorage: JsonRpcResult = await this.callPayloadSingle(payload);
        const result: IStorageValue = rawStorage.result as IStorageValue;

        return new StoredValue(result);
    }

    /**
     * Call a contract function with a given calldata.
     * @description This method is used to call a contract function with a given calldata.
     * @param {string | Address} to The address of the contract
     * @param {Buffer} data The calldata of the contract function
     * @param {string | Address} [from] The address to call the contract from
     * @param {BigNumberish} [height] The height to call the contract from
     * @param {ParsedSimulatedTransaction} [simulatedTransaction] UTXOs to simulate the transaction
     * @param {IAccessList} [accessList] The access list of previous simulation to use for this call
     * @returns {Promise<CallResult>} The result of the contract function call
     * @example await call('tb1pth90usc4f528aqphpjrfkkdm4vy8hxnt5gps6aau2nva6pxeshtqqzlt3a', Buffer.from('0x12345678'));
     * @throws {Error} If something went wrong while calling the contract
     */
    public async call(
        to: string | Address,
        data: Buffer | string,
        from?: Address,
        height?: BigNumberish,
        simulatedTransaction?: ParsedSimulatedTransaction,
        accessList?: IAccessList,
    ): Promise<CallResult | ICallRequestError> {
        const toStr: string = to.toString();
        const fromStr: string | undefined = from ? from.toHex() : undefined;

        let dataStr: string = Buffer.isBuffer(data) ? this.bufferToHex(data) : data;
        if (dataStr.startsWith('0x')) {
            dataStr = dataStr.slice(2);
        }

        const params: [string, string, string?, string?, SimulatedTransaction?, IAccessList?] = [
            toStr,
            dataStr,
            fromStr,
        ];

        if (height) {
            if (typeof height === 'object') {
                throw new Error('Height must be a number or bigint');
            }

            params.push(height.toString());
        } else {
            params.push(undefined);
        }

        if (simulatedTransaction) {
            params.push(this.parseSimulatedTransaction(simulatedTransaction));
        } else {
            params.push(undefined);
        }

        if (accessList) {
            params.push(accessList);
        } else {
            params.push(undefined);
        }

        const payload: JsonRpcPayload = this.buildJsonRpcPayload(JSONRpcMethods.CALL, params);
        const rawCall: JsonRpcResult = await this.callPayloadSingle(payload);

        const result: ICallResult = (rawCall.result as ICallResult) || rawCall;
        if (!rawCall.result) {
            return {
                error: (result as unknown as { error: { message: string } }).error.message,
            };
        }

        if ('error' in result) {
            return result;
        }

        if (result.revert) {
            let decodedError: string;

            try {
                decodedError = CallResult.decodeRevertData(
                    BufferHelper.bufferToUint8Array(Buffer.from(result.revert, 'base64')),
                );
            } catch {
                decodedError = result.revert;
            }

            return {
                error: decodedError,
            };
        }

        return new CallResult(result, this);
    }

    /**
     * Get the next block gas parameters.
     * @description This method is used to get the next block gas parameters. Such as base gas, gas limit, and gas price.
     * @returns {Promise<BlockGasParameters>} The gas parameters of the next block
     * @example await provider.gasParameters();
     * @throws {Error} If something went wrong while calling the contract
     */
    public async gasParameters(): Promise<BlockGasParameters> {
        if (!this.gasCache || Date.now() - this.lastFetchedGas > 10000) {
            this.lastFetchedGas = Date.now();
            this.gasCache = await this._gasParameters();
        }

        return this.gasCache;
    }

    /**
     * Send a raw transaction.
     * @description This method is used to send a raw transaction.
     * @param {string} tx The raw transaction to send as hex string
     * @param {boolean} [psbt] Whether the transaction is a PSBT or not
     * @returns {Promise<BroadcastedTransaction>} The result of the transaction
     * @example await sendRawTransaction('02000000000101ad897689f66c98daae5fdc3606235c1ad7a17b9e0a6aaa0ea9e58ecc1198ad2a0100000000ffffffff01a154c39400000000160014482038efcc91af945f0c756d07a46401920380520247304402201c1f8718dec637ddb41b42abc44dcbf35a94c6be6a9de8c1db48c9fa6e456b7e022032a4b3286808372a7ac2c5094d6341b4d61b17663f4ccd1c1d92efa85c7dada80121020373626d317ae8788ce3280b491068610d840c23ecb64c14075bbb9f670af52c00000000', false);
     * @throws {Error} If something went wrong while sending the transaction
     */
    public async sendRawTransaction(tx: string, psbt: boolean): Promise<BroadcastedTransaction> {
        // verify if tx is a valid hex string
        if (!/^[0-9A-Fa-f]+$/.test(tx)) {
            throw new Error('sendRawTransaction: Invalid hex string');
        }

        const payload: JsonRpcPayload = this.buildJsonRpcPayload(
            JSONRpcMethods.BROADCAST_TRANSACTION,
            [tx, psbt],
        );

        const rawTx: JsonRpcResult = await this.callPayloadSingle(payload);
        return rawTx.result as BroadcastedTransaction;
    }

    /**
     * Bulk send transactions.
     * @description This method is used to send multiple transactions at the same time.
     * @param {string[]} txs The raw transactions to send as hex string
     * @returns {Promise<BroadcastedTransaction[]>} The result of the transaction
     * @throws {Error} If something went wrong while sending the transaction
     */
    public async sendRawTransactions(txs: string[]): Promise<BroadcastedTransaction[]> {
        const payloads: JsonRpcPayload[] = txs.map((tx) => {
            return this.buildJsonRpcPayload(JSONRpcMethods.BROADCAST_TRANSACTION, [tx, false]);
        });

        const rawTxs: JsonRpcCallResult = await this.callMultiplePayloads(payloads);
        if ('error' in rawTxs) {
            throw new Error(`Error sending transactions: ${rawTxs.error}`);
        }

        return rawTxs.map((rawTx) => {
            return rawTx.result as BroadcastedTransaction;
        });
    }

    /**
     * Get block witnesses.
     * @description This method is used to get the witnesses of a block. This proves that the actions executed inside a block are valid and confirmed by the network. If the minimum number of witnesses are not met, the block is considered as potentially invalid.
     * @param {BlockTag} height The block number or hash, use -1 for latest block
     * @param {boolean} [trusted] Whether to trust the witnesses or not
     * @param {number} [limit] The maximum number of witnesses to return
     * @param {number} [page] The page number of the witnesses
     * @returns {Promise<BlockWitnesses>} The witnesses of the block
     * @example await getBlockWitness(123456n);
     * @throws {Error} If something went wrong while fetching the witnesses
     */
    public async getBlockWitness(
        height: BigNumberish = -1,
        trusted?: boolean,
        limit?: number,
        page?: number,
    ): Promise<BlockWitnesses> {
        const params: [BigNumberish, boolean?, number?, number?] = [height.toString()];

        if (trusted !== undefined && trusted !== null) params.push(trusted);
        if (limit !== undefined && limit !== null) params.push(limit);
        if (page !== undefined && page !== null) params.push(page);

        const payload: JsonRpcPayload = this.buildJsonRpcPayload(
            JSONRpcMethods.BLOCK_WITNESS,
            params,
        );

        const rawWitnesses: JsonRpcResult = await this.callPayloadSingle(payload);

        if ('error' in rawWitnesses) {
            throw new Error(
                `Error fetching block witnesses: ${rawWitnesses.error?.message || 'Unknown error'}`,
            );
        }

        const result = rawWitnesses.result as Array<{
            blockNumber: string;
            witnesses: RawBlockWitnessAPI[];
        }>;

        return parseBlockWitnesses(result);
    }

    /**
     * Get reorgs that happened between two blocks.
     * @description This method is used to get the reorgs that happened between two blocks.
     * @param {BigNumberish} [fromBlock] The block number to start from
     * @param {BigNumberish} [toBlock] The block number to end at
     * @returns {Promise<ReorgInformation>} The reorg information
     * @example await getReorg(123456n, 123457n);
     * @throws {Error} If something went wrong while fetching the reorg information
     */
    public async getReorg(
        fromBlock?: BigNumberish,
        toBlock?: BigNumberish,
    ): Promise<ReorgInformation[]> {
        const params: [string?, string?] = [];

        if (fromBlock !== undefined && fromBlock !== null) params.push(fromBlock.toString());
        if (toBlock !== undefined && toBlock !== null) params.push(toBlock.toString());

        const payload: JsonRpcPayload = this.buildJsonRpcPayload(JSONRpcMethods.REORG, params);
        const rawReorg: JsonRpcResult = await this.callPayloadSingle(payload);

        const result: ReorgInformation[] = rawReorg.result as ReorgInformation[];
        if (result.length > 0) {
            for (let i = 0; i < result.length; i++) {
                const res = result[i];

                res.fromBlock = BigInt('0x' + res.fromBlock.toString());
                res.toBlock = BigInt('0x' + res.toBlock.toString());
            }
        }

        return result;
    }

    /**
     * Requests to the OPNET node
     * @param {JsonRpcPayload | JsonRpcPayload[]} payload The method to call
     * @returns {Promise<JSONRpc2Result<T extends JSONRpcMethods>>} The result of the request
     */
    public abstract _send(payload: JsonRpcPayload | JsonRpcPayload[]): Promise<JsonRpcCallResult>;

    /**
     * Send a single payload. This method is used to send a single payload.
     * @param {JsonRpcPayload} payload The payload to send
     * @returns {Promise<JsonRpcResult>} The result of the payload
     * @throws {Error} If no data is returned
     * @private
     */
    public async callPayloadSingle(payload: JsonRpcPayload): Promise<JsonRpcResult> {
        const rawData: JsonRpcCallResult = await this._send(payload);
        if (!rawData.length) {
            throw new Error('No data returned');
        }

        const data = rawData.shift();
        if (!data) {
            throw new Error('Block not found');
        }

        return data as JSONRpc2ResponseResult<JSONRpcMethods>;
    }

    /**
     * Send multiple payloads. This method is used to send multiple payloads.
     * @param {JsonRpcPayload[]} payloads The payloads to send
     * @returns {Promise<JsonRpcResult>} The result of the payloads
     */
    public async callMultiplePayloads(payloads: JsonRpcPayload[]): Promise<JsonRpcCallResult> {
        const rawData: JsonRpcCallResult[] = (await this._send(
            payloads,
        )) as unknown as JsonRpcCallResult[];

        if ('error' in rawData) {
            throw new Error(`Error fetching block: ${rawData.error}`);
        }

        const data = rawData.shift();
        if (!data) {
            throw new Error('Block not found');
        }

        return data;
    }

    /**
     * Build a JSON RPC payload. This method is used to build a JSON RPC payload.
     * @param {JSONRpcMethods} method The method to call
     * @param {unknown[]} params The parameters to send
     * @returns {JsonRpcPayload} The JSON RPC payload
     */
    public buildJsonRpcPayload<T extends JSONRpcMethods>(
        method: T,
        params: unknown[],
    ): JsonRpcPayload {
        return {
            method: method,
            params: params,
            id: this.nextId++,
            jsonrpc: '2.0',
        };
    }

    /**
     * Get the public key information.
     * @description This method is used to get the public key information.
     * @param {string | string[] | Address | Address[]} addresses The address or addresses to get the public key information of
     * @param logErrors
     * @returns {Promise<AddressesInfo>} The public keys information
     * @example await getPublicKeysInfo(['addressA', 'addressB']);
     * @throws {Error} If the address is invalid
     */
    public async getPublicKeysInfo(
        addresses: string | string[] | Address | Address[],
        logErrors: boolean = false,
    ): Promise<AddressesInfo> {
        const addressArray = Array.isArray(addresses) ? addresses : [addresses];

        addressArray.forEach((addr) => {
            if (this.validateAddress(addr, this.network) === null) {
                throw new Error(`Invalid address: ${addr}`);
            }
        });

        const method = JSONRpcMethods.PUBLIC_KEY_INFO;
        const payload: JsonRpcPayload = this.buildJsonRpcPayload(method, [addressArray]);
        const data: JsonRpcResult = await this.callPayloadSingle(payload);

        if (data.error) {
            const errorData = (data as JsonRpcError).error;
            const errorMessage = typeof errorData === 'string' ? errorData : errorData.message;

            throw new Error(errorMessage);
        }

        const response: AddressesInfo = {};

        const result = data.result as IPublicKeyInfoResult;
        const keys = Object.keys(result);
        for (const pubKey of keys) {
            const pubKeyValue = result[pubKey];
            if ('error' in pubKeyValue) {
                if (logErrors) {
                    console.error(
                        `Error fetching public key info for ${pubKey}: ${pubKeyValue.error}`,
                    );
                }

                continue;
            }

            response[pubKey] = pubKeyValue.originalPubKey
                ? Address.fromString(pubKeyValue.originalPubKey)
                : Address.fromString(pubKeyValue.tweakedPubkey);
        }

        return response;
    }

    /**
     * Get the latest epoch.
     * @description This method is used to get the latest epoch in the OPNet protocol.
     * @returns {Promise<Epoch>} The latest epoch
     * @example await getLatestEpoch();
     * @throws {Error} If something went wrong while fetching the epoch
     */
    public async getLatestEpoch(includeSubmissions: boolean): Promise<Epoch> {
        const payload: JsonRpcPayload = this.buildJsonRpcPayload(JSONRpcMethods.LATEST_EPOCH, []);

        const rawEpoch: JsonRpcResult = await this.callPayloadSingle(payload);
        const result: RawEpoch = rawEpoch.result as RawEpoch;

        return new Epoch(result);
    }

    /**
     * Get an epoch by its number.
     * @description This method is used to get an epoch by its number.
     * @param {BigNumberish} epochNumber The epoch number (-1 for latest)
     * @param {boolean} [includeSubmissions] Whether to include submissions in the response
     * @returns {Promise<Epoch | EpochWithSubmissions>} The requested epoch
     * @example await getEpochByNumber(123n);
     * @throws {Error} If something went wrong while fetching the epoch
     */
    public async getEpochByNumber(
        epochNumber: BigNumberish,
        includeSubmissions: boolean = false,
    ): Promise<Epoch | EpochWithSubmissions> {
        const payload: JsonRpcPayload = this.buildJsonRpcPayload(
            JSONRpcMethods.GET_EPOCH_BY_NUMBER,
            [epochNumber.toString(), includeSubmissions],
        );

        const rawEpoch: JsonRpcResult = await this.callPayloadSingle(payload);
        if ('error' in rawEpoch) {
            throw new Error(`Error fetching epoch: ${rawEpoch.error?.message || 'Unknown error'}`);
        }

        const result: RawEpochWithSubmissions = rawEpoch.result as RawEpochWithSubmissions;
        return includeSubmissions || result.submissions
            ? new EpochWithSubmissions(result)
            : new Epoch(result);
    }

    /**
     * Get an epoch by its hash.
     * @description This method is used to get an epoch by its hash.
     * @param {string} epochHash The epoch hash
     * @param {boolean} [includeSubmissions] Whether to include submissions in the response
     * @returns {Promise<Epoch | EpochWithSubmissions>} The requested epoch
     * @example await getEpochByHash('0x1234567890abcdef...');
     * @throws {Error} If something went wrong while fetching the epoch
     */
    public async getEpochByHash(
        epochHash: string,
        includeSubmissions: boolean = false,
    ): Promise<Epoch | EpochWithSubmissions> {
        const payload: JsonRpcPayload = this.buildJsonRpcPayload(JSONRpcMethods.GET_EPOCH_BY_HASH, [
            epochHash,
            includeSubmissions,
        ]);

        const rawEpoch: JsonRpcResult = await this.callPayloadSingle(payload);
        if ('error' in rawEpoch) {
            throw new Error(`Error fetching epoch: ${rawEpoch.error?.message || 'Unknown error'}`);
        }

        const result: RawEpochWithSubmissions = rawEpoch.result as RawEpochWithSubmissions;
        return includeSubmissions || result.submissions
            ? new EpochWithSubmissions(result)
            : new Epoch(result);
    }

    /**
     * Get the current epoch mining template.
     * @description This method is used to get the current epoch mining template with target hash and requirements.
     * @returns {Promise<EpochTemplate>} The epoch template
     * @example await getEpochTemplate();
     * @throws {Error} If something went wrong while fetching the template
     */
    public async getEpochTemplate(): Promise<EpochTemplate> {
        const payload: JsonRpcPayload = this.buildJsonRpcPayload(
            JSONRpcMethods.GET_EPOCH_TEMPLATE,
            [],
        );

        const rawTemplate: JsonRpcResult = await this.callPayloadSingle(payload);
        if ('error' in rawTemplate) {
            throw new Error(
                `Error fetching epoch template: ${rawTemplate.error?.message || 'Unknown error'}`,
            );
        }

        const result: RawEpochTemplate = rawTemplate.result as RawEpochTemplate;
        return new EpochTemplate(result);
    }

    /**
     * Submit a new epoch solution.
     * @description This method is used to submit a SHA-1 collision solution for epoch mining.
     * @param {EpochSubmissionParams} params The parameters for the epoch submission
     * @returns {Promise<SubmittedEpoch>} The submission result
     * @example await submitEpoch({
     *     epochNumber: 123n,
     *     targetHash: Buffer.from('00000000000000000000000000000000', 'hex'),
     *     salt: Buffer.from('0a0a0a0a0a0a00a', 'hex'),
     *     publicKey: Address.dead(),
     *     graffiti: Buffer.from('Hello, world!'),
     *     signature: Buffer.from('1234567890abcdef', 'hex'),
     * });
     * @throws {Error} If something went wrong while submitting the epoch
     */
    public async submitEpoch(params: EpochSubmissionParams): Promise<SubmittedEpoch> {
        const payload: JsonRpcPayload = this.buildJsonRpcPayload(JSONRpcMethods.SUBMIT_EPOCH, [
            {
                epochNumber: params.epochNumber.toString(),
                targetHash: this.bufferToHex(params.targetHash),
                salt: this.bufferToHex(params.salt),
                publicKey: '0x' + params.publicKey.originalPublicKeyBuffer().toString('hex'),
                signature: this.bufferToHex(params.signature),
                graffiti: params.graffiti ? this.bufferToHex(params.graffiti) : undefined,
            },
        ]);

        const rawSubmission: JsonRpcResult = await this.callPayloadSingle(payload);
        if ('error' in rawSubmission) {
            throw new Error(
                `Error submitting epoch: ${rawSubmission.error?.message || 'Unknown error'}`,
            );
        }

        const result: RawSubmittedEpoch = rawSubmission.result as RawSubmittedEpoch;
        return new SubmittedEpoch(result);
    }

    protected abstract providerUrl(url: string): string;

    private async _gasParameters(): Promise<BlockGasParameters> {
        const payload: JsonRpcPayload = this.buildJsonRpcPayload(JSONRpcMethods.GAS, []);
        const rawCall: JsonRpcResult = await this.callPayloadSingle(payload);

        if ('error' in rawCall) {
            throw new Error(`Error fetching gas parameters: ${rawCall.error}`);
        }

        const result: IBlockGasParametersInput = rawCall.result as IBlockGasParametersInput;
        return new BlockGasParameters(result);
    }

    private parseSimulatedTransaction(
        transaction: ParsedSimulatedTransaction,
    ): SimulatedTransaction {
        return {
            inputs: transaction.inputs.map((input) => {
                return {
                    txId: input.txId.toString('base64'),
                    outputIndex: input.outputIndex,
                    scriptSig: input.scriptSig.toString('base64'),
                    coinbase: input.coinbase ? input.coinbase.toString('base64') : undefined,
                    flags: input.flags,
                };
            }),
            outputs: transaction.outputs.map((output) => {
                return {
                    index: output.index,
                    to: output.to,
                    value: output.value.toString(),

                    scriptPubKey: output.scriptPubKey?.toString('base64') || undefined,
                    flags: output.flags || TransactionOutputFlags.hasTo,
                };
            }),
        };
    }

    private bufferToHex(buffer: Buffer): string {
        return buffer.toString('hex');
    }

    private bigintToBase64(bigint: bigint): string {
        return Buffer.from(BufferHelper.pointerToUint8Array(bigint)).toString('base64');
    }
}
