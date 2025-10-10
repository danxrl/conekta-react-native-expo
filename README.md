# conekta-react-native-expo

Conekta React Native Expo allows you to tokenize (encrypt) your end user's card data.

## API documentation

- [Documentation for the latest stable release](https://docs.expo.dev/versions/latest/sdk/conekta-react-native-expo/)
- [Documentation for the main branch](https://docs.expo.dev/versions/unversioned/sdk/conekta-react-native-expo/)

## Installation in managed Expo projects

For [managed](https://docs.expo.dev/archive/managed-vs-bare/) Expo projects, please follow the installation instructions in the [API documentation for the latest stable release](#api-documentation). If you follow the link and there is no documentation available then this library is not yet usable within managed projects &mdash; it is likely to be included in an upcoming Expo SDK release.

## Installation in bare React Native projects

For bare React Native projects, you must ensure that you have [installed and configured the `expo` package](https://docs.expo.dev/bare/installing-expo-modules/) before continuing.

### Add the package to your npm dependencies

```
npm install conekta-react-native-expo
```

### Configure the Expo plugin

Add the library plugin to your `app.json`/`app.config.js` and provide your Conekta public key. The plugin stores the key on both platforms so the native module can authenticate requests when `createToken` is invoked.

```json
{
  "expo": {
    "plugins": [
      [
        "conekta-react-native-expo",
        {
          "publicKey": "key_test_xxxxxxxxxxxxxxxx"
        }
      ]
    ]
  }
}
```

### Configure for Android

No extra manual changes are required once the plugin writes the public key.

### Configure for iOS

No extra manual changes are required. Run `npx pod-install` after installing the npm package so native headers are available.

## Usage

```ts
import { createToken } from 'conekta-react-native-expo';

const token = await createToken({
  name: 'Juan Perez',
  number: '4242424242424242',
  cvc: '123',
  expMonth: '01',
  expYear: '28',
});

console.log(token.id);
```

## Contributing

Contributions are very welcome! Please refer to guidelines described in the [contributing guide]( https://github.com/expo/expo#contributing).
