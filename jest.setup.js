jest.mock('react-native-nitro-sqlite', () => {
  const mockExecute = jest.fn(() => ({
    rows: [{ count: 0 }],
  }));
  return {
    Database: {
      open: jest.fn(() => ({
        execute: mockExecute,
      })),
    },
  };
});

jest.mock('react-native-fs', () => ({
  readFile: jest.fn(() => Promise.resolve('')),
  writeFile: jest.fn(() => Promise.resolve()),
  unlink: jest.fn(() => Promise.resolve()),
  exists: jest.fn(() => Promise.resolve(true)),
  DocumentDirectoryPath: '',
}));

jest.mock('react-native-vision-camera', () => ({
  Camera: 'Camera',
  useCameraDevice: jest.fn(() => ({})),
  useCameraPermission: jest.fn(() => ({
    hasPermission: true,
    requestPermission: jest.fn(() => Promise.resolve(true)),
  })),
}));

jest.mock('onnxruntime-react-native', () => ({
  InferenceSession: {
    create: jest.fn(() => Promise.resolve({
      run: jest.fn(() => Promise.resolve({
        output: { data: new Float32Array(128), dims: [1, 128] },
      })),
      release: jest.fn(),
    })),
  },
  Tensor: jest.fn(),
}));

jest.mock('@react-native-ml-kit/face-detection', () => ({
  detect: jest.fn(() => Promise.resolve([])),
}));
