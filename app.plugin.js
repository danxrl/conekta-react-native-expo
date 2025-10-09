module.exports = function withConekta(config) {
  const withAllowBackupFix = require('./plugin/withAllowBackupFix');
  return withAllowBackupFix(config, 'false');
};
