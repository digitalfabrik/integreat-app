export default {
  type: 'languageDetector',
  async: false,
  init: (): void => {},
  detect: jest.fn<string[], []>(() => {
    return ['en']
  }),
  cacheUserLanguage: (): void => {}
}
