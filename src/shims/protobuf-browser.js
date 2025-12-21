// Browser shim for protobufjs - uses the pre-bundled minimal version
import protobuf from 'protobufjs/minimal.js';

export default protobuf;
export const Reader = protobuf.Reader;
export const Writer = protobuf.Writer;
export const util = protobuf.util;
export const roots = protobuf.roots;
export const configure = protobuf.configure;
export const rpc = protobuf.rpc;
