import { JsonRpcProvider } from 'ethers';
import { AbstractRpcProvider } from './AbstractRpcProvider.js';
export declare class JSONRpcProvider extends AbstractRpcProvider {
    private readonly url;
    protected readonly provider: JsonRpcProvider;
    constructor(url: string);
    protected providerUrl(url: string): string;
}
