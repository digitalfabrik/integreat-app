export default {
  type: 'languageDetector',
  async: true, // flags below detection to be async
  detect: callback => { return 'en' },
  init: () => {},
  cacheUserLanguage: () => {}
}
