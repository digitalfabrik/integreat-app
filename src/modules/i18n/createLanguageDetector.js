// @flow

export default (getLocale: () => string) => ({
  type: 'languageDetector',
  async: false,
  detect: () => {
    const locale = getLocale()

    if (locale.length < 2) {
      throw Error('locale has wrong format')
    }

    return locale.substring(0, 2)
  },
  init: () => {},
  cacheUserLanguage: () => {}
})
