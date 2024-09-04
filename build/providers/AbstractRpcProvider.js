import '../serialize/BigInt.js';
import { BufferHelper } from '@btc-vision/bsi-binary';
import { WrappedGeneration } from '@btc-vision/transaction';
import { networks } from 'bitcoinjs-lib';
import { UTXO } from '../bitcoin/UTXOs.js';
import { Block } from '../block/Block.js';
import { CallResult } from '../contracts/CallResult.js';
import { ContractData } from '../contracts/ContractData.js';
import { StoredValue } from '../storage/StoredValue.js';
import { TransactionReceipt } from '../transactions/metadata/TransactionReceipt.js';
import { TransactionParser } from '../transactions/TransactionParser.js';
import { GenerateTarget } from './interfaces/Generate.js';
import { JSONRpcMethods } from './interfaces/JSONRpcMethods.js';
export class AbstractRpcProvider {
    constructor() {
        this.nextId = 0;
    }
    async getBlockNumber() {
        const payload = this.buildJsonRpcPayload(JSONRpcMethods.BLOCK_BY_NUMBER, []);
        const rawBlockNumber = await this.callPayloadSingle(payload);
        const result = rawBlockNumber.result;
        return BigInt(result);
    }
    async getBlock(blockNumberOrHash, prefetchTxs = false) {
        const method = typeof blockNumberOrHash === 'string'
            ? JSONRpcMethods.GET_BLOCK_BY_HASH
            : JSONRpcMethods.GET_BLOCK_BY_NUMBER;
        const payload = this.buildJsonRpcPayload(method, [
            blockNumberOrHash,
            prefetchTxs,
        ]);
        const block = await this.callPayloadSingle(payload);
        const result = block.result;
        return new Block(result);
    }
    async getBlocks(blockNumbers, prefetchTxs = false) {
        const payloads = blockNumbers.map((blockNumber) => {
            return this.buildJsonRpcPayload(JSONRpcMethods.GET_BLOCK_BY_NUMBER, [
                blockNumber,
                prefetchTxs,
            ]);
        });
        const blocks = await this.callMultiplePayloads(payloads);
        if ('error' in blocks) {
            const error = blocks.error;
            throw new Error(`Error fetching block: ${error.message}`);
        }
        return blocks.map((block) => {
            if ('error' in block) {
                throw new Error(`Error fetching block: ${block.error}`);
            }
            const result = block.result;
            return new Block(result);
        });
    }
    async getBlockByHash(blockHash) {
        return await this.getBlock(blockHash);
    }
    async getBalance(addressLike, filterOrdinals = true) {
        const address = addressLike.toString();
        const payload = this.buildJsonRpcPayload(JSONRpcMethods.GET_BALANCE, [
            address,
            filterOrdinals
        ]);
        const rawBalance = await this.callPayloadSingle(payload);
        const result = rawBalance.result;
        if (!result || (result && !result.startsWith('0x'))) {
            throw new Error(`Invalid balance returned from provider: ${result}`);
        }
        return BigInt(result);
    }
    async getUXTOs(address, optimize = false) {
        const addressStr = address.toString();
        const payload = this.buildJsonRpcPayload(JSONRpcMethods.GET_UTXOS, [
            addressStr,
            optimize,
        ]);
        const rawUXTOs = await this.callPayloadSingle(payload);
        const result = rawUXTOs.result || [];
        return result.map((utxo) => {
            return new UTXO(utxo);
        });
    }
    async getTransaction(txHash) {
        const payload = this.buildJsonRpcPayload(JSONRpcMethods.GET_TRANSACTION_BY_HASH, [txHash]);
        const rawTransaction = await this.callPayloadSingle(payload);
        const result = rawTransaction.result;
        if ('error' in rawTransaction) {
            throw new Error(`Error fetching transaction: ${rawTransaction.error?.message || 'Unknown error'}`);
        }
        return TransactionParser.parseTransaction(result);
    }
    async getTransactionReceipt(txHash) {
        const payload = this.buildJsonRpcPayload(JSONRpcMethods.GET_TRANSACTION_RECEIPT, [txHash]);
        const rawTransaction = await this.callPayloadSingle(payload);
        return new TransactionReceipt(rawTransaction.result);
    }
    async getNetwork() {
        if (this.network) {
            return this.network;
        }
        const network = await this.getChainId();
        switch (network) {
            case 1n:
                return networks.bitcoin;
            case 2n:
                return networks.testnet;
            case 3n:
                return networks.regtest;
            default:
                throw new Error(`Invalid chain id: ${network}`);
        }
    }
    async getChainId() {
        if (this.chainId !== undefined)
            return this.chainId;
        const payload = this.buildJsonRpcPayload(JSONRpcMethods.CHAIN_ID, []);
        const rawChainId = await this.callPayloadSingle(payload);
        if ('error' in rawChainId) {
            throw new Error(`Something went wrong while fetching: ${rawChainId.error}`);
        }
        const chainId = rawChainId.result;
        this.chainId = BigInt(chainId);
        return this.chainId;
    }
    async getCode(address, onlyBytecode = false) {
        const addressStr = address.toString();
        const payload = this.buildJsonRpcPayload(JSONRpcMethods.GET_CODE, [
            addressStr,
            onlyBytecode,
        ]);
        const rawCode = await this.callPayloadSingle(payload);
        if (rawCode.error) {
            throw new Error(`${rawCode.error.code}: Something went wrong while fetching: ${rawCode.error.message}`);
        }
        const result = rawCode.result;
        if ('contractAddress' in result) {
            return new ContractData(result);
        }
        else {
            return Buffer.from(result.bytecode, 'base64');
        }
    }
    async getStorageAt(address, rawPointer, proofs = true, height) {
        const addressStr = address.toString();
        const pointer = typeof rawPointer === 'string' ? rawPointer : this.bigintToBase64(rawPointer);
        const params = [addressStr, pointer, proofs];
        if (height) {
            params.push(height.toString());
        }
        const payload = this.buildJsonRpcPayload(JSONRpcMethods.GET_STORAGE_AT, params);
        const rawStorage = await this.callPayloadSingle(payload);
        const result = rawStorage.result;
        return new StoredValue(result);
    }
    async call(to, data, from, height) {
        const toStr = to.toString();
        const fromStr = from ? from.toString() : null;
        let dataStr = Buffer.isBuffer(data) ? this.bufferToHex(data) : data;
        if (dataStr.startsWith('0x')) {
            dataStr = dataStr.slice(2);
        }
        const params = [toStr, dataStr];
        if (fromStr) {
            params.push(fromStr);
        }
        if (height) {
            params.push(height.toString());
        }
        const payload = this.buildJsonRpcPayload(JSONRpcMethods.CALL, params);
        const rawCall = await this.callPayloadSingle(payload);
        const result = rawCall.result;
        if ('error' in result) {
            return result;
        }
        return new CallResult(result);
    }
    async sendRawTransaction(tx, psbt) {
        if (!/^[0-9A-Fa-f]+$/.test(tx)) {
            throw new Error('sendRawTransaction: Invalid hex string');
        }
        const payload = this.buildJsonRpcPayload(JSONRpcMethods.BROADCAST_TRANSACTION, [tx, psbt]);
        const rawTx = await this.callPayloadSingle(payload);
        const result = rawTx.result;
        if (result && result.identifier) {
            return {
                ...result,
                identifier: BigInt(result.identifier),
            };
        }
        return result;
    }
    async getBlockWitness(height = -1, trusted, limit, page) {
        const params = [height.toString()];
        if (trusted !== undefined && trusted !== null)
            params.push(trusted);
        if (limit !== undefined && limit !== null)
            params.push(limit);
        if (page !== undefined && page !== null)
            params.push(page);
        const payload = this.buildJsonRpcPayload(JSONRpcMethods.BLOCK_WITNESS, params);
        const rawWitnesses = await this.callPayloadSingle(payload);
        const result = rawWitnesses.result;
        for (let i = 0; i < result.length; i++) {
            result[i].blockNumber = BigInt('0x' + result[i].blockNumber);
        }
        return result;
    }
    async getReorg(fromBlock, toBlock) {
        const params = [];
        if (fromBlock !== undefined && fromBlock !== null)
            params.push(fromBlock.toString());
        if (toBlock !== undefined && toBlock !== null)
            params.push(toBlock.toString());
        const payload = this.buildJsonRpcPayload(JSONRpcMethods.REORG, params);
        const rawReorg = await this.callPayloadSingle(payload);
        const result = rawReorg.result;
        if (result.length > 0) {
            for (let i = 0; i < result.length; i++) {
                const res = result[i];
                res.fromBlock = BigInt('0x' + res.fromBlock);
                res.toBlock = BigInt('0x' + res.toBlock);
            }
        }
        return result;
    }
    async requestTrustedPublicKeyForBitcoinWrapping(amount) {
        const payload = this.buildJsonRpcPayload(JSONRpcMethods.GENERATE, [
            GenerateTarget.WRAP,
            amount.toString(),
        ]);
        const rawPublicKey = await this.callPayloadSingle(payload);
        const result = rawPublicKey.result;
        return new WrappedGeneration(result);
    }
    async callPayloadSingle(payload) {
        const rawData = await this._send(payload);
        if (!rawData.length) {
            throw new Error('No data returned');
        }
        const data = rawData.shift();
        if (!data) {
            throw new Error('Block not found');
        }
        return data;
    }
    async callMultiplePayloads(payloads) {
        const rawData = (await this._send(payloads));
        if ('error' in rawData) {
            throw new Error(`Error fetching block: ${rawData.error}`);
        }
        const data = rawData.shift();
        if (!data) {
            throw new Error('Block not found');
        }
        return data;
    }
    bufferToHex(buffer) {
        return buffer.toString('hex');
    }
    bigintToBase64(bigint) {
        return Buffer.from(BufferHelper.pointerToUint8Array(bigint)).toString('base64');
    }
    buildJsonRpcPayload(method, params) {
        return {
            method: method,
            params: params,
            id: this.nextId++,
            jsonrpc: '2.0',
        };
    }
}
