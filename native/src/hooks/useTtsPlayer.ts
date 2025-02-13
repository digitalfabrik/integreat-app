import { useContext, useLayoutEffect, useState } from 'react'

import { addingPeriodsToDom, segmentation } from 'shared'
import { LocalNewsModel, PageModel, TunewsModel } from 'shared/api'

import { TtsContext, TtsContextType } from '../components/TtsContainer'
import { AppContext } from '../contexts/AppContextProvider'

const useTtsPlayer = (model?: PageModel | LocalNewsModel | TunewsModel | undefined): TtsContextType => {
  const { languageCode } = useContext(AppContext)
  const ttsContext = useContext(TtsContext)
  const [previousSentences] = useState(ttsContext.sentences)
  const { setSentences } = ttsContext

  useLayoutEffect(() => {
    if (model && model.content.length > 0) {
      const sentences: string[] = segmentation(languageCode, addingPeriodsToDom(model.content))
      setSentences([model.title, ...sentences].filter(sentence => sentence.length > 0))
    } else {
      setSentences([])
    }
    return () => setSentences(previousSentences)
  }, [previousSentences, setSentences, model, languageCode])

  return ttsContext
}

export default useTtsPlayer
