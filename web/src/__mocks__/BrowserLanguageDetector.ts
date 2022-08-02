const settings: {
  language?: string
} = {
  language: undefined,
}
export default {
  type: 'languageDetector',
  async: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  init: (): void => {},
  detect: jest.fn<string[], []>(() => {
    const found: string[] = []

    if (settings.language) {
      found.push(settings.language)
    }

    return [...found, 'en']
  }),
  cacheUserLanguage: (language: string): void => {
    settings.language = language
  },
}
