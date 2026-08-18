import type { TranslationsType } from '../../types.ts'
import ar from './ar.json' with { type: 'json' }
import ckb from './ckb.json' with { type: 'json' }
import de from './de.json' with { type: 'json' }
import en from './en.json' with { type: 'json' }
import es from './es.json' with { type: 'json' }
import fr from './fr.json' with { type: 'json' }
import hr from './hr.json' with { type: 'json' }
import ka from './ka.json' with { type: 'json' }
import kmr from './kmr.json' with { type: 'json' }
import mk from './mk.json' with { type: 'json' }
import pes from './pes.json' with { type: 'json' }
import prs from './prs.json' with { type: 'json' }
import ps from './ps.json' with { type: 'json' }
import ru from './ru.json' with { type: 'json' }
import so from './so.json' with { type: 'json' }
import sq from './sq.json' with { type: 'json' }
import srCyrl from './sr-Cyrl.json' with { type: 'json' }
import srLatn from './sr-Latn.json' with { type: 'json' }
import ti from './ti.json' with { type: 'json' }
import tr from './tr.json' with { type: 'json' }
import uk from './uk.json' with { type: 'json' }
import ur from './ur.json' with { type: 'json' }

const translations = {
  ar,
  ckb,
  de,
  en,
  es,
  fr,
  hr,
  ka,
  kmr,
  mk,
  pes,
  prs,
  ps,
  ru,
  so,
  sq,
  'sr-Cyrl': srCyrl,
  'sr-Latn': srLatn,
  ti,
  tr,
  uk,
  ur,
} satisfies TranslationsType

export default translations
