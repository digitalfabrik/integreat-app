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
  const location = useLocation()

  const sentences = useMemo(() => {
    if (model) {
      return [model.title.concat('.'), ...segmentation(languageCode ?? '', addingPeriodsToDom(model.content))]
    }

    return []
  }, [model, languageCode])

  useEffect(() => {
    tts.setSentences(sentences)
    return () => {
      tts.setSentences([])
    }
    // I disabled eslint due to tts changes every render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sentences, tts.setSentences])

  useEffect(() => {
    const synth = window.speechSynthesis
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (synth !== undefined) {
      synth.cancel()
    }
  }, [location.pathname])

  return {
    enabled: tts.enabled,
    canRead: tts.canRead,
    visible: tts.visible,
    setVisible: tts.setVisible,
    sentences: tts.sentences,
    setSentences: tts.setSentences,
  }
}

export default useTtsPlayer
