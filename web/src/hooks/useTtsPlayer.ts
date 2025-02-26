import { useContext, useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'

import { segmentText, parseHTML } from 'shared'
import { EventModel, LocalNewsModel, PageModel, TunewsModel } from 'shared/api'

import { TtsContext, TtsContextType } from '../components/TtsContainer'

const useTtsPlayer = (
  languageCode: string,
  model: PageModel | LocalNewsModel | TunewsModel | EventModel | null | undefined,
): TtsContextType => {
  const tts = useContext(TtsContext)
  const { setSentences } = tts
  const location = useLocation()

  const sentences = useMemo(() => {
    if (model) {
      return [model.title, ...segmentText(parseHTML(model.content, { addPeriods: true }), { languageCode })]
    }

    return []
  }, [model, languageCode])

  useEffect(() => {
    setSentences(sentences)
    return () => setSentences([])
  }, [sentences, setSentences])

  return tts
}

export default useTtsPlayer
