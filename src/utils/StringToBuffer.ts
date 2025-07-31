export function stringToBuffer(str: string): Buffer {
    return Buffer.from(str.replace('0x', ''), 'hex');
}
