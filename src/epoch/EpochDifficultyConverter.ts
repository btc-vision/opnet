export class EpochDifficultyConverter {
    /**
     * Convert matching bits to actual difficulty value
     * Difficulty = 2^bits
     *
     * This ensures that:
     * - 20 bits = difficulty of 1,048,576
     * - 30 bits = difficulty of 1,073,741,824
     * - 40 bits = difficulty of 1,099,511,627,776
     *
     * So a 40-bit share is worth 1,048,576x more than a 20-bit share,
     * not just 2x more
     */
    public static bitsToScaledDifficulty(bits: number): bigint {
        return 2n ** BigInt(Math.max(0, bits));
    }

    /**
     * Format difficulty for display
     */
    public static formatDifficulty(difficulty: bigint): string {
        if (difficulty < 1000n) {
            return difficulty.toString();
        } else if (difficulty < BigInt(1e6)) {
            return (difficulty / BigInt(1e3)).toString() + 'K';
        } else if (difficulty < BigInt(1e9)) {
            return (difficulty / BigInt(1e6)).toString() + 'M';
        } else if (difficulty < BigInt(1e12)) {
            return (difficulty / BigInt(1e9)).toString() + 'G';
        } else if (difficulty < BigInt(1e15)) {
            return (difficulty / BigInt(1e12)).toString() + 'T';
        } else {
            return (difficulty / BigInt(1e15)).toString() + 'P';
        }
    }
}
