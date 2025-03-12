import { useContext, useEffect } from 'react'

import { segmentText, parseHTML } from 'shared'
import { LocalNewsModel, PageModel, TunewsModel } from 'shared/api'

import { TtsContext, TtsContextType } from '../components/TtsContainer'

const useTtsPlayer = (
  model: PageModel | LocalNewsModel | TunewsModel | undefined | null,
  languageCode: string,
): TtsContextType => {
  const tts = useContext(TtsContext)
  const { setSentences } = tts

  useEffect(() => {
    if (model && model.content.length > 0) {
      const sentences = [model.title, ...segmentText(parseHTML(model.content), { languageCode })]
      const sentencesWithPeriods = sentences
        .filter(sentence => sentence.length > 0)
        // The SpeechSynthesisAPI seems to require dots or other punctuation marks to detect the end of a sentence/utterance
        // Without this, the tts utterance idles without continuing to the next sentence
        .map(it => (it.endsWith('.?!:;') ? it : `${it}.`))
      setSentences(sentencesWithPeriods)
    }
    return () => setSentences([])
  }, [model, languageCode, setSentences])

  return tts
}

export default useTtsPlayer
