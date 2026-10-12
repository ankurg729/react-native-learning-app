const path = require('path');

module.exports = {
  preset: '@react-native/jest-preset',
  setupFiles: [
    require.resolve('@react-native/jest-preset/jest/setup.js'),
    path.join(
      __dirname,
      'node_modules/react-native-gesture-handler/jestSetup.js',
    ),
    path.join(__dirname, 'jest.setup.js'),
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|react-native-gesture-handler|react-native-screens|react-native-safe-area-context|react-native-linear-gradient|react-native-svg|lucide-react-native|@react-native-async-storage|@react-native-clipboard)/)',
  ],
};
