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
  status: jest.fn().mockReturnValue({
    status: 'init: complete',
  }),
  voices: jest.fn().mockReturnValue([
    { lang: 'en-GB', name: 'Unused English Voice' },
    { lang: 'en-GB', name: 'Daniel' },
    { lang: 'de-DE', name: 'Unused German Voice' },
    { lang: 'de-DE', name: 'Anna' },
    { lang: 'fr-FR', name: 'Claude' },
  ]),
}

export default MockTts
