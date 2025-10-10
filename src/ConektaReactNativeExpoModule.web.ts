import { registerWebModule, NativeModule } from "expo";

import type { TokenCard, TokenData } from "./ConektaReactNativeExpo.types";

class ConektaReactNativeExpoModule extends NativeModule {
  async createToken(_card: TokenCard): Promise<TokenData> {
    throw new TypeError("createToken is not supported on web.");
  }
}

export default registerWebModule(
  ConektaReactNativeExpoModule,
  "ConektaReactNativeExpoModule",
);
