Object.defineProperty(window, 'speechSynthesis', {
  value: {
    cancel: jest.fn(),
  },
  writable: true,
})

const MockTts = {
  init: jest.fn().mockResolvedValue(true),
  speak: jest.fn().mockResolvedValue(true),
  reset: jest.fn(),
  cancel: jest.fn(),
  pause: jest.fn(),
  resume: jest.fn(),
  detect: jest.fn().mockReturnValue({
    speechSynthesis: {},
  }),
  voices: jest.fn().mockReturnValue([{ lang: 'en-US' }]),
}

export default MockTts
