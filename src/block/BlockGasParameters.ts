export interface IBlockGasParameters {
    readonly blockNumber: bigint;
    readonly gasUsed: bigint;
    readonly targetGasLimit: bigint;
    readonly ema: bigint;
    readonly baseGas: bigint;
    readonly gasPerSat: bigint;
}

export interface IBlockGasParametersInput {
    readonly blockNumber: string;
    readonly gasUsed: string;
    readonly targetGasLimit: string;
    readonly ema: string;
    readonly baseGas: string;
    readonly gasPerSat: string;
}

export class BlockGasParameters implements IBlockGasParameters {
    public readonly blockNumber: bigint;
    public readonly gasUsed: bigint;
    public readonly targetGasLimit: bigint;
    public readonly ema: bigint;
    public readonly baseGas: bigint;
    public readonly gasPerSat: bigint;

    public constructor(data: IBlockGasParametersInput) {
        this.blockNumber = BigInt(data.blockNumber);
        this.gasUsed = BigInt(data.gasUsed);
        this.targetGasLimit = BigInt(data.targetGasLimit);
        this.ema = BigInt(data.ema);
        this.baseGas = BigInt(data.baseGas);
        this.gasPerSat = BigInt(data.gasPerSat);
    }
}
