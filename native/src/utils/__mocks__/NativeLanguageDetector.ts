export default {
  type: 'languageDetector',
  async: false,
  init: (): void => {},
  detect: jest.fn<string, []>(() => 'en'),
  cacheUserLanguage: (): void => {}
}
