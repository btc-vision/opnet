/**
 * Utility functions for decoding revert data.
 */

const ERROR_SELECTOR_BYTES = Uint8Array.from([0x63, 0x73, 0x9d, 0x5c]);

function areBytesEqual(a: Uint8Array | Buffer, b: Uint8Array | Buffer): boolean {
    if (a.length !== b.length) return false;

    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
            return false;
        }
    }

    return true;
}

function startsWithErrorSelector(revertDataBytes: Uint8Array | Buffer): boolean {
    return (
        revertDataBytes.length >= 4 &&
        areBytesEqual(Buffer.from(revertDataBytes.subarray(0, 4)), ERROR_SELECTOR_BYTES)
    );
}

function bytesToHexString(byteArray: Uint8Array): string {
    return Array.from(byteArray, function (byte) {
        return ('0' + (byte & 0xff).toString(16)).slice(-2);
    }).join('');
}

/**
 * Decode revert data into a human-readable string.
 * @param revertDataBytes - The raw revert data bytes.
 * @returns The decoded revert message.
 */
export function decodeRevertData(revertDataBytes: Uint8Array | Buffer): string {
    if (startsWithErrorSelector(revertDataBytes)) {
        const decoder = new TextDecoder();
        const buf = Buffer.from(revertDataBytes.subarray(8));

        return decoder.decode(buf);
    } else {
        return `Unknown Revert: 0x${bytesToHexString(revertDataBytes)}`;
    }
}
