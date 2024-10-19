interface IPublicKeyInfoData {
    [key: string]: {
        lowByte?: number;
        originalPubKey?: string;
        tweakedPubkey?: string;
        p2pkh?: string;
        p2shp2wpkh?: string;
        p2tr?: string;
        p2wpkh?: string;
    };
}

interface IPublicKeyInfo {
    lowByte?: number;
    originalPubKey?: string;
    tweakedPubkey?: string;
    p2pkh?: string;
    p2shp2wpkh?: string;
    p2tr?: string;
    p2wpkh?: string;
}
