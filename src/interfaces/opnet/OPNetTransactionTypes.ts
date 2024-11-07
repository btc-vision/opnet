export enum OPNetTransactionTypes {
    Generic = 'Generic',
    Deployment = 'Deployment',
    Interaction = 'Interaction',
    //WrapInteraction = 'WrapInteraction',
    //UnwrapInteraction = 'UnwrapInteraction',
}

export type InteractionType = OPNetTransactionTypes.Interaction;
//| OPNetTransactionTypes.WrapInteraction
//| OPNetTransactionTypes.UnwrapInteraction;
