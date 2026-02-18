import { fromBase64, fromHex } from '@btc-vision/bitcoin';

export function stringToBuffer(str: string): Uint8Array {
    return fromHex(str.startsWith('0x') ? str.slice(2) : str);
}

export function stringBase64ToBuffer(str: string): Uint8Array {
    return fromBase64(str);
}
