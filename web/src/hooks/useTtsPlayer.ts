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
      setSentences(sentences.filter(sentence => sentence.length > 0))
    }
    return () => setSentences([])
  }, [model, languageCode, setSentences])

  return tts
}

export default useTtsPlayer
