const MockTts = {
  init: jest.fn(),
  status: jest.fn(),
  speak: jest.fn(),
  cancel: jest.fn(),
  pause: jest.fn(),
  resume: jest.fn(),
  reset: jest.fn(),
  detect: jest.fn(),
  filterVoices: jest.fn(),
  voices: jest.fn(),
  on: jest.fn(),
  defaults: jest.fn(),
  debug: jest.fn(),
}

export default MockTts
