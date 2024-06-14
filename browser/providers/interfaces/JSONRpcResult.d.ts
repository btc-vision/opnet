import { JSONRpcMethods } from './JSONRpcMethods.js';
export interface JSONRpc2ResultData<T extends JSONRpcMethods> {
}
export declare enum JSONRPCErrorCode {
    PARSE_ERROR = -32700,
    INVALID_REQUEST = -32600,
    METHOD_NOT_FOUND = -32601,
    INVALID_PARAMS = -32602,
    INTERNAL_ERROR = -32603,
    SERVER_ERROR = -32000,
    APPLICATION_ERROR = -32099,
    SYSTEM_ERROR = -32098,
    TRANSPORT_ERROR = -32097,
    GENERIC_ERROR = -32096
}
export declare enum JSONRPCErrorHttpCodes {
    PARSE_ERROR = 500,
    INVALID_REQUEST = 400,
    METHOD_NOT_FOUND = 404,
    INVALID_PARAMS = 400,
    INTERNAL_ERROR = 500,
    SERVER_ERROR = 500,
    APPLICATION_ERROR = 500,
    SYSTEM_ERROR = 500,
    TRANSPORT_ERROR = 500,
    GENERIC_ERROR = 500
}
export interface JSONRpcErrorData<T extends JSONRpcMethods> {
}
export interface JSONRpcResultError<T extends JSONRpcMethods> {
    readonly code: JSONRPCErrorCode;
    readonly message: string;
    readonly data?: JSONRpcErrorData<T>;
}
interface JSONRpc2ResultBase<T extends JSONRpcMethods> {
    readonly jsonrpc: '2.0';
    readonly id: number | string | null;
    readonly result?: JSONRpc2ResultData<T>;
    readonly error?: JSONRpcResultError<T>;
}
export interface JSONRpc2ResponseResult<T extends JSONRpcMethods> extends JSONRpc2ResultBase<T> {
    readonly result: JSONRpc2ResultData<T>;
}
export interface JSONRpc2ResponseError<T extends JSONRpcMethods> extends JSONRpc2ResultBase<T> {
    readonly error: JSONRpcResultError<T>;
}
export type JsonRpcError = JSONRpc2ResponseError<JSONRpcMethods>;
export type JsonRpcResult = JSONRpc2ResponseResult<JSONRpcMethods>;
export type JSONRpc2Result<T extends JSONRpcMethods> = JSONRpc2ResponseResult<T> | JSONRpc2ResponseError<T>;
export type JsonRpcCallResult = (JsonRpcResult | JsonRpcError)[];
export {};
