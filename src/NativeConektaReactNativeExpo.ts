import { TurboModuleRegistry, type TurboModule } from 'react-native';

export interface Spec extends TurboModule {
  createCardToken(input: {
    name: string;
    number: string;
    cvc: string;
    expMonth: string;
    expYear: string;
    publicKey: string;
  }): Promise<{ id: string }>
}

export default TurboModuleRegistry.getEnforcing<Spec>('ConektaReactNativeExpo');
