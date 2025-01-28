const MockTts = {
  speak: jest.fn(),
  stop: jest.fn(),
  setDefaultLanguage: jest.fn(async () => undefined),
  requestInstallEngine: jest.fn(async () => undefined),
  addEventListener: jest.fn(async () => undefined),
  removeAllListeners: jest.fn(),
  getInitStatus: jest.fn(() => Promise.resolve('success')),
  addListener: jest.fn(),
}

export default MockTts
