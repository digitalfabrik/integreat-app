import { useFocusEffect } from '@react-navigation/native'
import { useCallback, useContext, useState } from 'react'
import segment from 'sentencex'

import { parseHTML } from 'shared'
import { LocalNewsModel, PageModel, TunewsModel } from 'shared/api'

import { TtsContext, TtsContextType } from '../components/TtsContainer'
import { AppContext } from '../contexts/AppContextProvider'

const useTtsPlayer = (model?: PageModel | LocalNewsModel | TunewsModel | undefined): TtsContextType => {
  const { languageCode } = useContext(AppContext)
  const ttsContext = useContext(TtsContext)
  const [previousSentences] = useState(ttsContext.sentences)
  const { setSentences } = ttsContext

  useFocusEffect(
    useCallback(() => {
      if (model && model.content.length > 0) {
        const content = parseHTML(model.content)
        const sentences: string[] = segment(languageCode, content)
        setSentences([model.title, ...sentences].filter(sentence => sentence.length > 0))
      } else {
        setSentences([])
      }
      return () => setSentences(previousSentences)
    }, [previousSentences, setSentences, model, languageCode]),
  )

  return ttsContext
}

export default useTtsPlayer
