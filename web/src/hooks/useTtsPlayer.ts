import { useContext, useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'

import { addingPeriodsToDom, segmentation } from 'shared'
import { EventModel, LocalNewsModel, PageModel, TunewsModel } from 'shared/api'

import { TtsContext, TtsContextType } from '../components/TtsContainer'

const useTtsPlayer = (
  languageCode?: string,
  model?: PageModel | LocalNewsModel | TunewsModel | EventModel | null,
): TtsContextType => {
  const tts = useContext(TtsContext)
  const { setSentences } = tts
  const location = useLocation()

  const sentences = useMemo(() => {
    if (model) {
      return [model.title.concat('.'), ...segmentation(languageCode ?? '', addingPeriodsToDom(model.content))]
    }

    return []
  }, [model, languageCode])

  useEffect(() => {
    setSentences(sentences)
    return () => setSentences([])
  }, [sentences, setSentences])

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    window.speechSynthesis?.cancel()
  }, [location.pathname])

  return tts
}

export default useTtsPlayer
