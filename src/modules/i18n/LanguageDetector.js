export default {
  type: 'languageDetector',
  async: false, // flags below detection to be async
  detect: callback => { return 'en' },
  init: () => {},
  cacheUserLanguage: () => {}
}
