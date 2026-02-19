/**
 * Subscription types for WebSocket API.
 * Use these enums instead of raw strings.
 */
export enum SubscriptionType {
    /** Subscribe to new block notifications */
    BLOCKS = 0,

    /** Subscribe to new epoch notifications */
    EPOCHS = 1,

    /** Subscribe to new mempool transaction notifications */
    MEMPOOL = 2,
}

/**
 * Get the string name for a subscription type (for logging)
 */
export function getSubscriptionTypeName(type: SubscriptionType): string {
    switch (type) {
        case SubscriptionType.BLOCKS:
            return 'BLOCKS';
        case SubscriptionType.EPOCHS:
            return 'EPOCHS';
        case SubscriptionType.MEMPOOL:
            return 'MEMPOOL';
        default:
            return 'UNKNOWN';
    }
}
