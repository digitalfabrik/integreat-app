export default {
  type: 'languageDetector',
  async: false,
  init: (): void => undefined,
  detect: jest.fn<string, []>(() => 'en'),
  cacheUserLanguage: (): void => undefined,
}
