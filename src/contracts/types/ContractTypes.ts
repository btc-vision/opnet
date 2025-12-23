import { DecodedCallResult } from '../../common/CommonTypes.js';

export type ContractDecodedObjectResult = { [key: string]: DecodedCallResult };
export type DecodedOutput = { values: Array<DecodedCallResult>; obj: ContractDecodedObjectResult };
