const settings: {
  language?: string;
} = {
  language: undefined
};
export default {
  type: 'languageDetector',
  async: false,
  init: () => {},
  detect: jest.fn<[], string[]>(() => {
    const found: string[] = [];

    if (settings.language) {
      found.push(settings.language);
    }

    return [...found, 'en'];
  }),
  cacheUserLanguage: (language: string) => {
    settings.language = language;
  }
};