const { withPlugins, withStringsXml, withInfoPlist } = require('@expo/config-plugins');

const ANDROID_STRING_NAME = 'conekta_public_key';
const INFO_PLIST_KEY = 'ConektaPublicKey';

function resolvePublicKey(config, props) {
  const provided = props?.publicKey ?? config?.extra?.conektaPublicKey ?? config?.extra?.conekta?.publicKey;
  if (!provided || typeof provided !== 'string' || provided.trim().length === 0) {
    throw new Error(
      'conekta-react-native-expo: publicKey is required. Configure it in app.json via plugin options.'
    );
  }
  return provided.trim();
}

function applyAndroid(config, publicKey) {
  return withStringsXml(config, (cfg) => {
    const resources = cfg.modResults.resources ?? (cfg.modResults.resources = {});
    const strings = resources.string ?? (resources.string = []);

    const existingIndex = strings.findIndex(
      (item) => item.$?.name === ANDROID_STRING_NAME
    );

    const entry = {
      $: {
        name: ANDROID_STRING_NAME,
        translatable: 'false',
      },
      _: publicKey,
    };

    if (existingIndex >= 0) {
      strings[existingIndex] = entry;
    } else {
      strings.push(entry);
    }

    return cfg;
  });
}

function applyIOS(config, publicKey) {
  return withInfoPlist(config, (cfg) => {
    cfg.modResults[INFO_PLIST_KEY] = publicKey;
    return cfg;
  });
}

module.exports = function withConekta(config, props = {}) {
  const publicKey = resolvePublicKey(config, props);

  config.extra = config.extra || {};
  config.extra.conekta = {
    ...(config.extra.conekta || {}),
    publicKey,
  };

  return withPlugins(config, [
    (c) => applyAndroid(c, publicKey),
    (c) => applyIOS(c, publicKey),
  ]);
};
