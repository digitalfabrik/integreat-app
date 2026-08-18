import type { TranslationsType } from '../../types.ts'
import ar from './ar.json' with { type: 'json' }
import de from './de.json' with { type: 'json' }
import en from './en.json' with { type: 'json' }
import es from './es.json' with { type: 'json' }
import fr from './fr.json' with { type: 'json' }
import it from './it.json' with { type: 'json' }
import pl from './pl.json' with { type: 'json' }
import ro from './ro.json' with { type: 'json' }
import ru from './ru.json' with { type: 'json' }
import tr from './tr.json' with { type: 'json' }
import zhCN from './zh-CN.json' with { type: 'json' }

const translations = {
  ar,
  de,
  en,
  es,
  fr,
  it,
  pl,
  ro,
  ru,
  tr,
  'zh-CN': zhCN,
} satisfies TranslationsType

export default translations
