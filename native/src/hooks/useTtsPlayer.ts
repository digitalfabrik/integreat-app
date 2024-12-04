import { useContext, useEffect, useMemo } from 'react'
import segment from 'sentencex'

import { parseHTML } from 'shared'
import { LocalNewsModel, PageModel, TunewsModel } from 'shared/api'

import { ttsContext, TtsContextType } from '../components/TtsContainer'
import buildConfig from '../constants/buildConfig'
import { AppContext } from '../contexts/AppContextProvider'

const unsupportedLanguagesForTts = ['fa', 'ka', 'kmr']

const useTtsPlayer = (model?: PageModel | LocalNewsModel | TunewsModel | undefined): TtsContextType => {
  const { languageCode } = useContext(AppContext)
  const tts = useContext(ttsContext)
  const sentences = useMemo(() => {
    if (model) {
      const content = parseHTML(model.content)
      return [model.title, ...segment(languageCode, content)]
    }

    return null
  }, [model, languageCode])

  const enabled =
    Array.isArray(sentences) &&
    sentences.length > 0 &&
    Boolean(buildConfig().featureFlags.tts) &&
    !unsupportedLanguagesForTts.includes(languageCode)

  useEffect(() => {
    if (sentences) {
      tts.setSentences(sentences)
    }
    tts.setEnabled(enabled)
    return () => {
      tts.setSentences([])
      tts.setEnabled(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, sentences, languageCode])

  return {
    enabled: tts.enabled,
    setEnabled: tts.setEnabled,
    visible: tts.visible,
    setVisible: tts.setVisible,
    sentences: tts.sentences,
    setSentences: tts.setSentences,
  }
}

export default useTtsPlayer
