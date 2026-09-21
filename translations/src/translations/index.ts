import type { TranslationsType } from '../types.ts'
import am from './am.json' with { type: 'json' }
import ar from './ar.json' with { type: 'json' }
import bg from './bg.json' with { type: 'json' }
import ckb from './ckb.json' with { type: 'json' }
import cs from './cs.json' with { type: 'json' }
import da from './da.json' with { type: 'json' }
import de from './de.json' with { type: 'json' }
import el from './el.json' with { type: 'json' }
import en from './en.json' with { type: 'json' }
import es from './es.json' with { type: 'json' }
import fi from './fi.json' with { type: 'json' }
import fr from './fr.json' with { type: 'json' }
import hi from './hi.json' with { type: 'json' }
import hr from './hr.json' with { type: 'json' }
import hu from './hu.json' with { type: 'json' }
import id from './id.json' with { type: 'json' }
import it from './it.json' with { type: 'json' }
import ka from './ka.json' with { type: 'json' }
import kmr from './kmr.json' with { type: 'json' }
import mk from './mk.json' with { type: 'json' }
import nl from './nl.json' with { type: 'json' }
import om from './om.json' with { type: 'json' }
import pes from './pes.json' with { type: 'json' }
import pl from './pl.json' with { type: 'json' }
import prs from './prs.json' with { type: 'json' }
import ps from './ps.json' with { type: 'json' }
import pt from './pt.json' with { type: 'json' }
import ro from './ro.json' with { type: 'json' }
import rom from './rom.json' with { type: 'json' }
import ru from './ru.json' with { type: 'json' }
import sk from './sk.json' with { type: 'json' }
import so from './so.json' with { type: 'json' }
import sq from './sq.json' with { type: 'json' }
import srCyrl from './sr-Cyrl.json' with { type: 'json' }
import srLatn from './sr-Latn.json' with { type: 'json' }
import sw from './sw.json' with { type: 'json' }
import th from './th.json' with { type: 'json' }
import ti from './ti.json' with { type: 'json' }
import tr from './tr.json' with { type: 'json' }
import uk from './uk.json' with { type: 'json' }
import ur from './ur.json' with { type: 'json' }
import vi from './vi.json' with { type: 'json' }
import zhCN from './zh-CN.json' with { type: 'json' }

const translations = {
  am,
  ar,
  bg,
  ckb,
  cs,
  da,
  de,
  el,
  en,
  es,
  fi,
  fr,
  hi,
  hr,
  hu,
  id,
  it,
  ka,
  kmr,
  mk,
  nl,
  om,
  pes,
  pl,
  prs,
  ps,
  pt,
  ro,
  rom,
  ru,
  sk,
  so,
  sq,
  'sr-Cyrl': srCyrl,
  'sr-Latn': srLatn,
  sw,
  th,
  ti,
  tr,
  uk,
  ur,
  vi,
  'zh-CN': zhCN,
} satisfies TranslationsType

export default translations
