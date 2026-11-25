// Metro does not support dynamic imports yet: https://github.com/facebook/metro/issues/52
// If unsure about the language code, all supported ones are here:
// https://github.com/formatjs/formatjs/blob/main/packages/intl-displaynames/supported-locales.generated.ts
const importDisplayNamesPackage = async (languageCode: string): Promise<void> => {
  switch (languageCode) {
    case 'am':
      await import('@formatjs/intl-displaynames/locale-data/am.js')
      break
    case 'ar':
      await import('@formatjs/intl-displaynames/locale-data/ar.js')
      break
    case 'bg':
      await import('@formatjs/intl-displaynames/locale-data/bg.js')
      break
    case 'bs':
      await import('@formatjs/intl-displaynames/locale-data/bs.js')
      break
    case 'ckb':
      await import('@formatjs/intl-displaynames/locale-data/ckb.js')
      break
    case 'cs':
      await import('@formatjs/intl-displaynames/locale-data/cs.js')
      break
    case 'da':
      await import('@formatjs/intl-displaynames/locale-data/da.js')
      break
    case 'de':
      await import('@formatjs/intl-displaynames/locale-data/de.js')
      break
    case 'el':
      await import('@formatjs/intl-displaynames/locale-data/el.js')
      break
    case 'en':
      await import('@formatjs/intl-displaynames/locale-data/en.js')
      break
    case 'es':
      await import('@formatjs/intl-displaynames/locale-data/es.js')
      break
    case 'fi':
      await import('@formatjs/intl-displaynames/locale-data/fi.js')
      break
    case 'fr':
      await import('@formatjs/intl-displaynames/locale-data/fr.js')
      break
    case 'ga':
      await import('@formatjs/intl-displaynames/locale-data/ga.js')
      break
    case 'hi':
      await import('@formatjs/intl-displaynames/locale-data/hi.js')
      break
    case 'hr':
      await import('@formatjs/intl-displaynames/locale-data/hr.js')
      break
    case 'hu':
      await import('@formatjs/intl-displaynames/locale-data/hu.js')
      break
    case 'hy':
      await import('@formatjs/intl-displaynames/locale-data/hy.js')
      break
    case 'id':
      await import('@formatjs/intl-displaynames/locale-data/id.js')
      break
    case 'it':
      await import('@formatjs/intl-displaynames/locale-data/it.js')
      break
    case 'ka':
      await import('@formatjs/intl-displaynames/locale-data/ka.js')
      break
    case 'kmr':
      await import('@formatjs/intl-displaynames/locale-data/ku.js')
      break
    case 'mk':
      await import('@formatjs/intl-displaynames/locale-data/mk.js')
      break
    case 'nl':
      await import('@formatjs/intl-displaynames/locale-data/nl.js')
      break
    case 'om':
      await import('@formatjs/intl-displaynames/locale-data/om.js')
      break
    case 'pes':
      await import('@formatjs/intl-displaynames/locale-data/fa.js')
      break
    case 'pl':
      await import('@formatjs/intl-displaynames/locale-data/pl.js')
      break
    case 'prs':
      await import('@formatjs/intl-displaynames/locale-data/fa.js')
      break
    case 'ps':
      await import('@formatjs/intl-displaynames/locale-data/ps.js')
      break
    case 'pt':
      await import('@formatjs/intl-displaynames/locale-data/pt.js')
      break
    case 'ro':
      await import('@formatjs/intl-displaynames/locale-data/ro.js')
      break
    case 'rom':
      await import('@formatjs/intl-displaynames/locale-data/ro.js')
      break
    case 'ru':
      await import('@formatjs/intl-displaynames/locale-data/ru.js')
      break
    case 'sk':
      await import('@formatjs/intl-displaynames/locale-data/sk.js')
      break
    case 'so':
      await import('@formatjs/intl-displaynames/locale-data/so.js')
      break
    case 'sq':
      await import('@formatjs/intl-displaynames/locale-data/sq.js')
      break
    case 'sr-Cyrl':
      await import('@formatjs/intl-displaynames/locale-data/sr-Cyrl.js')
      break
    case 'sr-Latn':
      await import('@formatjs/intl-displaynames/locale-data/sr-Latn.js')
      break
    case 'sw':
      await import('@formatjs/intl-displaynames/locale-data/sw.js')
      break
    case 'th':
      await import('@formatjs/intl-displaynames/locale-data/th.js')
      break
    case 'ti':
      await import('@formatjs/intl-displaynames/locale-data/ti.js')
      break
    case 'tr':
      await import('@formatjs/intl-displaynames/locale-data/tr.js')
      break
    case 'uk':
      await import('@formatjs/intl-displaynames/locale-data/uk.js')
      break
    case 'ur':
      await import('@formatjs/intl-displaynames/locale-data/ur.js')
      break
    case 'vi':
      await import('@formatjs/intl-displaynames/locale-data/vi.js')
      break
    case 'zh-CN':
      await import('@formatjs/intl-displaynames/locale-data/zh.js')
      break

    default:
      await import('@formatjs/intl-displaynames/locale-data/de.js')
      break
  }
}

export default importDisplayNamesPackage
