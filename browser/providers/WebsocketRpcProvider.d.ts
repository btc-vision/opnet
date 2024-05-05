import { WebSocketProvider } from 'ethers';
import { AbstractRpcProvider } from './AbstractRpcProvider.js';
export declare class WebSocketRpcProvider extends AbstractRpcProvider {
    private readonly wsUrl;
    protected readonly provider: WebSocketProvider;
    constructor(url: string);
    protected providerUrl(url: string): string;
}
