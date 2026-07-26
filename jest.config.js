module.exports = {
  preset: '@react-native/jest-preset',
  setupFiles: ['./jest.setup.js'],
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@react-native|react-native|react-native-.*|@react-navigation|@react-native-ml-kit|onnxruntime-react-native|react-native-reanimated|react-native-safe-area-context|react-native-screens|react-native-nitro-sqlite|react-native-nitro-modules|react-native-vision-camera|react-native-fs)/)',
  ],
};
