import { fromBase64, fromHex } from '@btc-vision/bitcoin';

export function stringToBuffer(str: string): Uint8Array {
    return fromHex(str.replace('0x', ''));
}

export function stringBase64ToBuffer(str: string): Uint8Array {
    return fromBase64(str);
}
