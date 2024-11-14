import { useContext, useEffect, useMemo } from 'react'
import segment from 'sentencex'

import { parseHTML } from 'shared'
import { EventModel, LocalNewsModel, PageModel, TunewsModel } from 'shared/api'

import { ttsContext, TtsContextType } from '../components/TtsContainer'

const useTtsPlayer = (model?: PageModel | LocalNewsModel | TunewsModel | EventModel | undefined): TtsContextType => {
  const tts = useContext(ttsContext)
  const sentences = useMemo(() => {
    if (model) {
      const content = parseHTML(model.content)
      return [model.title, ...segment(tts.languageCode, content)]
    }

    return null
  }, [model, tts.languageCode])

  useEffect(() => {
    if (sentences) {
      tts.setSentences(sentences)
      tts.setTitle(model?.title ?? '')
    }
    return () => {
      tts.setSentences([])
      tts.setTitle('')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sentences, tts.languageCode])

  return {
    sentenceIndex: tts.sentenceIndex,
    setSentenceIndex: tts.setSentenceIndex,
    visible: tts.visible,
    setVisible: tts.setVisible,
    title: tts.title,
    setTitle: tts.setTitle,
    volume: tts.volume,
    setVolume: tts.setVolume,
    sentences: tts.sentences,
    setSentences: tts.setSentences,
    languageCode: tts.languageCode,
  }
}

export default useTtsPlayer
