// Metro does not support dynamic imports yet: https://github.com/facebook/metro/issues/52
// If unsure about the language code, all supported ones are here:
// https://github.com/formatjs/formatjs/blob/main/packages/intl-displaynames/supported-locales.generated.ts
const importDisplayNamesPackage = async (languageCode: string): Promise<void> => {
  switch (languageCode) {
    case 'am':
      await import('@formatjs/intl-displaynames/locale-data/am')
      break
    case 'ar':
      await import('@formatjs/intl-displaynames/locale-data/ar')
      break
    case 'bg':
      await import('@formatjs/intl-displaynames/locale-data/bg')
      break
    case 'ckb':
      await import('@formatjs/intl-displaynames/locale-data/ckb')
      break
    case 'cs':
      await import('@formatjs/intl-displaynames/locale-data/cs')
      break
    case 'da':
      await import('@formatjs/intl-displaynames/locale-data/da')
      break
    case 'de':
      await import('@formatjs/intl-displaynames/locale-data/de')
      break
    case 'el':
      await import('@formatjs/intl-displaynames/locale-data/el')
      break
    case 'en':
      await import('@formatjs/intl-displaynames/locale-data/en')
      break
    case 'es':
      await import('@formatjs/intl-displaynames/locale-data/es')
      break
    case 'fi':
      await import('@formatjs/intl-displaynames/locale-data/fi')
      break
    case 'fr':
      await import('@formatjs/intl-displaynames/locale-data/fr')
      break
    case 'hi':
      await import('@formatjs/intl-displaynames/locale-data/hi')
      break
    case 'hr':
      await import('@formatjs/intl-displaynames/locale-data/hr')
      break
    case 'hu':
      await import('@formatjs/intl-displaynames/locale-data/hu')
      break
    case 'id':
      await import('@formatjs/intl-displaynames/locale-data/id')
      break
    case 'it':
      await import('@formatjs/intl-displaynames/locale-data/it')
      break
    case 'ka':
      await import('@formatjs/intl-displaynames/locale-data/ka')
      break
    case 'kmr':
      await import('@formatjs/intl-displaynames/locale-data/ku')
      break
    case 'mk':
      await import('@formatjs/intl-displaynames/locale-data/mk')
      break
    case 'nl':
      await import('@formatjs/intl-displaynames/locale-data/nl')
      break
    case 'om':
      await import('@formatjs/intl-displaynames/locale-data/om')
      break
    case 'pes':
      await import('@formatjs/intl-displaynames/locale-data/fa')
      break
    case 'pl':
      await import('@formatjs/intl-displaynames/locale-data/pl')
      break
    case 'prs':
      await import('@formatjs/intl-displaynames/locale-data/fa')
      break
    case 'ps':
      await import('@formatjs/intl-displaynames/locale-data/ps')
      break
    case 'pt':
      await import('@formatjs/intl-displaynames/locale-data/pt')
      break
    case 'ro':
      await import('@formatjs/intl-displaynames/locale-data/ro')
      break
    case 'rom':
      await import('@formatjs/intl-displaynames/locale-data/ro')
      break
    case 'ru':
      await import('@formatjs/intl-displaynames/locale-data/ru')
      break
    case 'sk':
      await import('@formatjs/intl-displaynames/locale-data/sk')
      break
    case 'so':
      await import('@formatjs/intl-displaynames/locale-data/so')
      break
    case 'sq':
      await import('@formatjs/intl-displaynames/locale-data/sq')
      break
    case 'sr-Cyrl':
      await import('@formatjs/intl-displaynames/locale-data/sr-Cyrl')
      break
    case 'sr-Latn':
      await import('@formatjs/intl-displaynames/locale-data/sr-Latn')
      break
    case 'sw':
      await import('@formatjs/intl-displaynames/locale-data/sw')
      break
    case 'th':
      await import('@formatjs/intl-displaynames/locale-data/th')
      break
    case 'ti':
      await import('@formatjs/intl-displaynames/locale-data/ti')
      break
    case 'tr':
      await import('@formatjs/intl-displaynames/locale-data/tr')
      break
    case 'uk':
      await import('@formatjs/intl-displaynames/locale-data/uk')
      break
    case 'ur':
      await import('@formatjs/intl-displaynames/locale-data/ur')
      break
    case 'vi':
      await import('@formatjs/intl-displaynames/locale-data/vi')
      break
    case 'zh-CN':
      await import('@formatjs/intl-displaynames/locale-data/zh')
      break

    default:
      await import('@formatjs/intl-displaynames/locale-data/de')
      break
  }
}

export default importDisplayNamesPackage
