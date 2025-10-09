import { type TurboModule } from 'react-native';
export interface Spec extends TurboModule {
    createCardToken(input: {
        name: string;
        number: string;
        cvc: string;
        expMonth: string;
        expYear: string;
        publicKey: string;
    }): Promise<{
        id: string;
    }>;
}
declare const _default: Spec;
export default _default;
//# sourceMappingURL=NativeConektaReactNativeExpo.d.ts.map