import { useContext, useEffect, useMemo } from 'react'
import segment from 'sentencex'

import { parseHTML } from 'shared'
import { LocalNewsModel, PageModel, TunewsModel } from 'shared/api'

import { ttsContext, TtsContextType } from '../components/TtsContainer'

const useTtsPlayer = (
  languageCode?: string,
  model?: PageModel | LocalNewsModel | TunewsModel | undefined,
): TtsContextType => {
  const tts = useContext(ttsContext)
  const sentences = useMemo(() => {
    if (model) {
      const content = parseHTML(model.content)
      return [model.title, ...segment(languageCode, content)]
    }

    return null
  }, [model, languageCode])

  useEffect(() => {
    if (sentences) {
      tts.setSentences(sentences)
    }
    return () => {
      tts.setSentences([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sentences, languageCode])

  return {
    visible: tts.visible,
    setVisible: tts.setVisible,
    sentences: tts.sentences,
    setSentences: tts.setSentences,
  }
}

export default useTtsPlayer
