module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'dotenv-import',
        {
          moduleName: '@env',
          path: '.env',
          safe: true,
          allowUndefined: false
        },
    'react-native-reanimated/plugin'
  ],
};
