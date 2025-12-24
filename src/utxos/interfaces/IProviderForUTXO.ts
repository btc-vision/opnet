import { JsonRpcPayload } from '../../providers/interfaces/JSONRpc.js';
import { JSONRpcMethods } from '../../providers/interfaces/JSONRpcMethods.js';
import { JsonRpcCallResult, JsonRpcResult } from '../../providers/interfaces/JSONRpcResult.js';

/**
 * Interface that describes what UTXOsManager needs from a provider.
 * This breaks the circular dependency between AbstractRpcProvider and UTXOsManager.
 */
export interface IProviderForUTXO {
    buildJsonRpcPayload<T extends JSONRpcMethods>(method: T, params: unknown[]): JsonRpcPayload;
    callPayloadSingle(payload: JsonRpcPayload): Promise<JsonRpcResult>;
    callMultiplePayloads(payloads: JsonRpcPayload[]): Promise<JsonRpcCallResult>;
}
