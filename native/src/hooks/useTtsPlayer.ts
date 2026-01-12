import { useFocusEffect } from '@react-navigation/native'
import { useCallback, useContext, useState } from 'react'

import { parseHTML, segmentText } from 'shared'
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
        const sentences = segmentText(parseHTML(model.content, true), { languageCode })
        setSentences([model.title, ...sentences])
      } else {
        setSentences([])
      }
      return () => setSentences(previousSentences)
    }, [previousSentences, setSentences, model, languageCode]),
  )

  return ttsContext
}

export default useTtsPlayer
