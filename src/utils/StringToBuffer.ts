export function stringToBuffer(str: string): Buffer {
    return Buffer.from(str.replace('0x', ''), 'hex');
}

export function stringBase64ToBuffer(str: string): Buffer {
    return Buffer.from(str, 'base64');
}
