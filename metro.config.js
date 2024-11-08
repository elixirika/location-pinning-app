const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { wrapWithReanimatedMetroConfig } = require('react-native-reanimated/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const defaultConfig = getDefaultConfig(__dirname);
const mergedConfig = mergeConfig(defaultConfig, {});

// in wrapping Metro configuration with Reanimated config, identifying misuses of the Reanimated API will be much easier than before
module.exports = wrapWithReanimatedMetroConfig(mergedConfig);
