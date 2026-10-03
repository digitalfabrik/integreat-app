import { useContext, useEffect } from 'react'

import { segmentText, parseHTML } from 'shared'
import { NewsModel, DocumentModel } from 'shared/api'

import { TtsContext, TtsContextType } from '../contexts/TtsContext'

type TtsPlayerOptions = {
  // Overrides the title of the model, e.g. for the root category
  title?: string
  // Titles of child pages, read out after the content (e.g. tiles or list items of pages without content)
  childTitles?: string[]
}

const useTtsPlayer = (
  model: DocumentModel | NewsModel | undefined | null,
  languageCode: string,
  { title, childTitles }: TtsPlayerOptions = {},
): TtsContextType => {
  const tts = useContext(TtsContext)
  const { setSentences } = tts

  useEffect(() => {
    const contentSentences =
      model && model.content.length > 0 ? segmentText(parseHTML(model.content, true), { languageCode }) : []
    const sentences = [...contentSentences, ...(childTitles ?? [])]
    if (model && sentences.length > 0) {
      setSentences([title ?? model.title, ...sentences])
    }
    return () => setSentences([])
  }, [model, languageCode, setSentences, title, childTitles])

  return tts
}

export default useTtsPlayer
