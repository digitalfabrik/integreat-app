import { useContext, useEffect } from 'react'

import { segmentText, parseHTML } from 'shared'
import { NewsModel, DocumentModel } from 'shared/api'

import { TtsContext, TtsContextType } from '../contexts/TtsContext'

const useTtsPlayer = (model: DocumentModel | NewsModel | undefined | null, languageCode: string): TtsContextType => {
  const tts = useContext(TtsContext)
  const { setSentences } = tts

  useEffect(() => {
    if (model && model.content.length > 0) {
      const sentences = segmentText(parseHTML(model.content, true), { languageCode })
      setSentences([model.title, ...sentences])
    }
    return () => setSentences([])
  }, [model, languageCode, setSentences])

  return tts
}

export default useTtsPlayer
