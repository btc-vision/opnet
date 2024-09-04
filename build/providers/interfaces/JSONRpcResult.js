export var JSONRPCErrorCode;
(function (JSONRPCErrorCode) {
    JSONRPCErrorCode[JSONRPCErrorCode["PARSE_ERROR"] = -32700] = "PARSE_ERROR";
    JSONRPCErrorCode[JSONRPCErrorCode["INVALID_REQUEST"] = -32600] = "INVALID_REQUEST";
    JSONRPCErrorCode[JSONRPCErrorCode["METHOD_NOT_FOUND"] = -32601] = "METHOD_NOT_FOUND";
    JSONRPCErrorCode[JSONRPCErrorCode["INVALID_PARAMS"] = -32602] = "INVALID_PARAMS";
    JSONRPCErrorCode[JSONRPCErrorCode["INTERNAL_ERROR"] = -32603] = "INTERNAL_ERROR";
    JSONRPCErrorCode[JSONRPCErrorCode["SERVER_ERROR"] = -32000] = "SERVER_ERROR";
    JSONRPCErrorCode[JSONRPCErrorCode["APPLICATION_ERROR"] = -32099] = "APPLICATION_ERROR";
    JSONRPCErrorCode[JSONRPCErrorCode["SYSTEM_ERROR"] = -32098] = "SYSTEM_ERROR";
    JSONRPCErrorCode[JSONRPCErrorCode["TRANSPORT_ERROR"] = -32097] = "TRANSPORT_ERROR";
    JSONRPCErrorCode[JSONRPCErrorCode["GENERIC_ERROR"] = -32096] = "GENERIC_ERROR";
})(JSONRPCErrorCode || (JSONRPCErrorCode = {}));
export var JSONRPCErrorHttpCodes;
(function (JSONRPCErrorHttpCodes) {
    JSONRPCErrorHttpCodes[JSONRPCErrorHttpCodes["PARSE_ERROR"] = 500] = "PARSE_ERROR";
    JSONRPCErrorHttpCodes[JSONRPCErrorHttpCodes["INVALID_REQUEST"] = 400] = "INVALID_REQUEST";
    JSONRPCErrorHttpCodes[JSONRPCErrorHttpCodes["METHOD_NOT_FOUND"] = 404] = "METHOD_NOT_FOUND";
    JSONRPCErrorHttpCodes[JSONRPCErrorHttpCodes["INVALID_PARAMS"] = 400] = "INVALID_PARAMS";
    JSONRPCErrorHttpCodes[JSONRPCErrorHttpCodes["INTERNAL_ERROR"] = 500] = "INTERNAL_ERROR";
    JSONRPCErrorHttpCodes[JSONRPCErrorHttpCodes["SERVER_ERROR"] = 500] = "SERVER_ERROR";
    JSONRPCErrorHttpCodes[JSONRPCErrorHttpCodes["APPLICATION_ERROR"] = 500] = "APPLICATION_ERROR";
    JSONRPCErrorHttpCodes[JSONRPCErrorHttpCodes["SYSTEM_ERROR"] = 500] = "SYSTEM_ERROR";
    JSONRPCErrorHttpCodes[JSONRPCErrorHttpCodes["TRANSPORT_ERROR"] = 500] = "TRANSPORT_ERROR";
    JSONRPCErrorHttpCodes[JSONRPCErrorHttpCodes["GENERIC_ERROR"] = 500] = "GENERIC_ERROR";
})(JSONRPCErrorHttpCodes || (JSONRPCErrorHttpCodes = {}));
