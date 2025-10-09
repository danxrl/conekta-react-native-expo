export type CardInput = {
    name: string;
    number: string;
    cvc: string;
    expMonth: string;
    expYear: string;
    publicKey: string;
};
export declare function createCardToken(input: CardInput): Promise<{
    id: string;
}>;
//# sourceMappingURL=index.d.ts.map