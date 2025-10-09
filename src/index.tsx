import ConektaReactNativeExpo from './NativeConektaReactNativeExpo';

export type CardInput = {
  name: string;
  number: string;
  cvc: string;
  expMonth: string;
  expYear: string;
  publicKey: string;
};

export async function createCardToken(input: CardInput) {
  return ConektaReactNativeExpo.createCardToken(input);
}
