export interface FeeRecommendation {
    low: string;
    medium: string;
    high: string;
}

export interface RawBitcoinFees {
    readonly conservative: string;
    readonly recommended: FeeRecommendation;
}

export interface BitcoinFees {
    readonly conservative: number;
    readonly recommended: {
        readonly low: number;
        readonly medium: number;
        readonly high: number;
    };
}

export interface IBlockGasParameters {
    readonly blockNumber: bigint;
    readonly gasUsed: bigint;
    readonly targetGasLimit: bigint;
    readonly ema: bigint;
    readonly baseGas: bigint;
    readonly gasPerSat: bigint;
    readonly bitcoin: BitcoinFees;
}

export interface IBlockGasParametersInput {
    readonly blockNumber: string;
    readonly gasUsed: string;
    readonly targetGasLimit: string;
    readonly ema: string;
    readonly baseGas: string;
    readonly gasPerSat: string;
    readonly bitcoin: RawBitcoinFees;
}

export class BlockGasParameters implements IBlockGasParameters {
    public readonly blockNumber: bigint;
    public readonly gasUsed: bigint;
    public readonly targetGasLimit: bigint;
    public readonly ema: bigint;
    public readonly baseGas: bigint;
    public readonly gasPerSat: bigint;
    public readonly bitcoin: BitcoinFees;

    public constructor(data: IBlockGasParametersInput) {
        this.blockNumber = BigInt(data.blockNumber);
        this.gasUsed = BigInt(data.gasUsed);
        this.targetGasLimit = BigInt(data.targetGasLimit);
        this.ema = BigInt(data.ema);
        this.baseGas = BigInt(data.baseGas);
        this.gasPerSat = BigInt(data.gasPerSat);

        this.bitcoin = {
            conservative: Number(data.bitcoin.conservative),
            recommended: {
                low: Number(data.bitcoin.recommended.low),
                medium: Number(data.bitcoin.recommended.medium),
                high: Number(data.bitcoin.recommended.high),
            },
        };
    }
}
