import { useFocusEffect } from '@react-navigation/native'
import { useCallback, useContext, useState } from 'react'

import { parseHTML, segmentText } from 'shared'
import { NewsModel, DocumentModel } from 'shared/api'

import { TtsContext, TtsContextType } from '../components/TtsContainer'
import { AppContext } from '../contexts/AppContext'

type TtsPlayerOptions = {
  // Overrides the title of the model, e.g. for the root category
  title?: string
  // Titles of child pages, read out after the content (e.g. tiles or list items of pages without content)
  childTitles?: string[]
}

const useTtsPlayer = (
  model?: DocumentModel | NewsModel | undefined,
  { title, childTitles }: TtsPlayerOptions = {},
): TtsContextType => {
  const { languageCode } = useContext(AppContext)
  const ttsContext = useContext(TtsContext)
  const [previousSentences] = useState(ttsContext.sentences)
  const { setSentences } = ttsContext

  useFocusEffect(
    useCallback(() => {
      const contentSentences =
        model && model.content.length > 0 ? segmentText(parseHTML(model.content, true), { languageCode }) : []
      const sentences = [...contentSentences, ...(childTitles ?? [])]
      if (model && sentences.length > 0) {
        setSentences([title ?? model.title, ...sentences])
      } else {
        setSentences([])
      }
      return () => setSentences(previousSentences)
    }, [previousSentences, setSentences, model, languageCode, title, childTitles]),
  )

  return ttsContext
}

export default useTtsPlayer
