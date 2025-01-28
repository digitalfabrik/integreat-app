import { useContext, useEffect, useMemo } from 'react'
import segment from 'sentencex'

import { parseHTML } from 'shared'
import { LocalNewsModel, PageModel, TunewsModel } from 'shared/api'

import { TtsContext, TtsContextType } from '../components/TtsContainer'
import { AppContext } from '../contexts/AppContextProvider'

const useTtsPlayer = (model?: PageModel | LocalNewsModel | TunewsModel | undefined): TtsContextType => {
  const { languageCode } = useContext(AppContext)
  const { setSentences, visible, setVisible, enabled, canRead } = useContext(TtsContext)
  const sentences = useMemo(() => {
    if (model) {
      const content = parseHTML(model.content)
      return [model.title, ...segment(languageCode, content)]
    }

    return []
  }, [model, languageCode])

  useEffect(() => {
    if (sentences.length) {
      setSentences(sentences)
    }
    return () => {
      setSentences([])
    }
  }, [sentences, setSentences])

  return {
    enabled,
    canRead,
    visible,
    setVisible,
    sentences,
    setSentences,
  }
}

export default useTtsPlayer
