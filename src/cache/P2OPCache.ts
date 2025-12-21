import { Network } from '@btc-vision/bitcoin';
import { Address } from '@btc-vision/transaction';
import { LRUCache } from './LRUCaching.js';

const P2OP_CACHE_MAX_SIZE = 5_000;
const p2opCache = new LRUCache<string, string>(P2OP_CACHE_MAX_SIZE);
const addressCache = new LRUCache<string, Address>(P2OP_CACHE_MAX_SIZE);

export const getP2op = (rawAddress: string, network: Network): string => {
    const cacheKey = `${network.bip32}:${network.pubKeyHash}:${network.bech32}:${rawAddress}`;
    let cached = p2opCache.get(cacheKey);
    if (cached === undefined) {
        let addr = addressCache.get(rawAddress);
        if (addr === undefined) {
            addr = Address.fromString(rawAddress);
            addressCache.set(rawAddress, addr);
        }
        cached = addr.p2op(network);
        p2opCache.set(cacheKey, cached);
    }
    return cached;
};
