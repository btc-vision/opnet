import { JSONRpcMethods } from './JSONRpcMethods.js';
import { JSONRpcParams } from './JSONRpcParams.js';

export type JSONRpcId = string | number | null;
export type JSONRpc2RequestParams<T extends JSONRpcMethods> = JSONRpcParams<T> | Array<unknown>;

export interface JSONRpc2Request<T extends JSONRpcMethods> {
    readonly jsonrpc: '2.0';
    method: T;
    readonly params: JSONRpc2RequestParams<T>;
    readonly id?: JSONRpcId;
}

export type JsonRpcPayload = JSONRpc2Request<JSONRpcMethods>;
