const { withPlugins, withAppBuildGradle, withPodfile } = require('@expo/config-plugins');

module.exports = function withConekta(config)  {
  return withPlugins(config, [
    (c) => withAppBuildGradle(c, (cfg) => {
      const m = cfg.modResults;
      if (!m.contents.includes('mavenCentral()')) {
        m.contents = m.contents.replace('repositories {', 'repositories {\n        mavenCentral()');
      }
      if (!m.contents.includes('io.conekta:conektasdk')) {
        m.contents = m.contents.replace(
          'dependencies {',
          'dependencies {\n    implementation "io.conekta:conektasdk:6.0.1"'
        );
      }
      return cfg;
    }),
    (c) => withPodfile(c, (cfg) => {
      if (!cfg.modResults.contents.includes("pod 'Conekta'")) {
        cfg.modResults.contents += `\n  pod 'Conekta', '~> 6.0'\n`;
      }
      return cfg;
    }),
  ]);
}
