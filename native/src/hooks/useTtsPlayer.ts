import { useContext, useEffect, useMemo } from 'react'
import segment from 'sentencex'

import { parseHTML } from 'shared'
import { LocalNewsModel, PageModel, TunewsModel } from 'shared/api'

import { TtsContext, TtsContextType } from '../components/TtsContainer'
import { AppContext } from '../contexts/AppContextProvider'

const useTtsPlayer = (model?: PageModel | LocalNewsModel | TunewsModel | undefined): TtsContextType => {
  const { languageCode } = useContext(AppContext)
  const { setSentences, visible, setVisible, enabled } = useContext(TtsContext)
  const sentences = useMemo(() => {
    if (model) {
      const content = parseHTML(model.content)
      return [model.title, ...segment(languageCode, content)]
    }

    return null
  }, [model, languageCode])

  useEffect(() => {
    if (sentences) {
      setSentences(sentences)
    }
    return () => {
      setSentences([])
    }
  }, [sentences, languageCode, setSentences])

  return {
    enabled,
    visible,
    setVisible,
    sentences,
    setSentences,
  }
}

export default useTtsPlayer
