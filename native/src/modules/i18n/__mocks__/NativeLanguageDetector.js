// @flow

export default {
  type: 'languageDetector',
  async: false,
  init: () => {},
  detect: jest.fn<[], string[]>(() => {
    return ['en']
  }),
  cacheUserLanguage: () => {}
}
