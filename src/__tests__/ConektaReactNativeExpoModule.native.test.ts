import type { TokenCard, TokenData } from "../ConektaReactNativeExpo.types";

const mockNativeModule = {
  createToken: jest.fn<Promise<TokenData>, [TokenCard]>(),
};

type ExpoMock = {
  requireNativeModule: jest.Mock<typeof mockNativeModule, [string]>;
};

const allowedPlatforms = new Set(["ios", "android"]);
const isNativeEnvironment = allowedPlatforms.has(process.env.EXPO_OS ?? "");

jest.mock("expo", () => ({
  requireNativeModule: jest.fn(() => mockNativeModule),
  NativeModule: class {},
}));

const describeOrSkip = isNativeEnvironment ? describe : describe.skip;

describeOrSkip("ConektaReactNativeExpo native module", () => {
  const loadExpoMock = () => require("expo") as ExpoMock;
  const loadModule = () =>
    require("../ConektaReactNativeExpoModule") as typeof import("../ConektaReactNativeExpoModule");
  const loadIndexModule = () =>
    require("../index") as typeof import("../index");

  beforeEach(() => {
    jest.resetModules();
    mockNativeModule.createToken.mockReset();
  });

  it("exports the native module instance by default", () => {
    const expoMock = loadExpoMock();
    const module = loadModule().default;

    expect(expoMock.requireNativeModule).toHaveBeenCalledWith(
      "ConektaReactNativeExpo",
    );
    expect(module).toBe(mockNativeModule);
  });

  it("delegates createToken calls to the native module", async () => {
    const expoMock = loadExpoMock();
    const { createToken } = loadModule();

    const card: TokenCard = {
      name: "Juan Perez",
      number: "4242424242424242",
      cvc: "123",
      expMonth: "01",
      expYear: "30",
    };

    const response: TokenData = {
      id: "tok_test",
      livemode: false,
      object: "token",
      used: false,
      createdAt: Date.now(),
    };

    mockNativeModule.createToken.mockResolvedValueOnce(response);

    await expect(createToken(card)).resolves.toEqual(response);
    expect(mockNativeModule.createToken).toHaveBeenCalledWith(card);
    expect(expoMock.requireNativeModule).toHaveBeenCalled();
  });

  it("re-exports module bindings from index.ts", async () => {
    const expoMock = loadExpoMock();
    const moduleExports = loadModule();
    const indexExports = loadIndexModule();

    expect(indexExports.default).toBe(moduleExports.default);

    const card: TokenCard = {
      name: "Maria Gomez",
      number: "4242424242424242",
      cvc: "456",
      expMonth: "02",
      expYear: "29",
    };

    const payload: TokenData = {
      id: "tok_export",
      livemode: false,
      object: "token",
      used: false,
      createdAt: Date.now(),
    };

    mockNativeModule.createToken.mockResolvedValueOnce(payload);

    await expect(indexExports.createToken(card)).resolves.toEqual(payload);
    expect(mockNativeModule.createToken).toHaveBeenCalledWith(card);
    expect(expoMock.requireNativeModule).toHaveBeenCalled();
  });
});
