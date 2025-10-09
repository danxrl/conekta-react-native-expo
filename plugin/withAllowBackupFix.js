const { withAndroidManifest } = require('@expo/config-plugins');

module.exports = function withAllowBackupFix(config, desired = 'false') {
  return withAndroidManifest(config, (cfg) => {
    const manifest = cfg.modResults.manifest;
    if (!manifest.$['xmlns:tools']) {
      manifest.$['xmlns:tools'] = 'http://schemas.android.com/tools';
    }
    const app = manifest.application?.[0];
    if (app) {
      app.$['android:allowBackup'] = desired;
      const prev = app.$['tools:replace'] || '';
      const items = new Set(
        prev
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
          .concat('android:allowBackup')
      );
      app.$['tools:replace'] = Array.from(items).join(',');
    }
    return cfg;
  });
};
