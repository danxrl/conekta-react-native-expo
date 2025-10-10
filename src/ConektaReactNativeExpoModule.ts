import { NativeModule, requireNativeModule } from "expo";

import type { TokenCard, TokenData } from "./ConektaReactNativeExpo.types";

type ConektaNativeModule = NativeModule & {
  createToken(card: TokenCard): Promise<TokenData>;
};

const module = requireNativeModule<ConektaNativeModule>(
  "ConektaReactNativeExpo",
);

export async function createToken(card: TokenCard) {
  return module.createToken(card);
}

export default module;
