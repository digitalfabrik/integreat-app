import { useContext, useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import segment from 'sentencex'

import { parseHTML } from 'shared'
import { EventModel, LocalNewsModel, PageModel, TunewsModel } from 'shared/api'

import { ttsContext, TtsContextType } from '../contexts/TtsContextProvider'

const useTtsPlayer = (
  languageCode?: string,
  model?: PageModel | LocalNewsModel | TunewsModel | EventModel | null,
): TtsContextType => {
  const tts = useContext(ttsContext)
  const location = useLocation()

  const sentences = useMemo(() => {
    if (model) {
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = model.content
      const appendPeriod = (elements: NodeListOf<HTMLElement>) => {
        elements.forEach((element: HTMLElement) => {
          const trimmedText = element.textContent?.trim()
          if (trimmedText && !trimmedText.endsWith('.')) {
            // eslint-disable-next-line no-param-reassign
            element.textContent = trimmedText.concat('.')
          }
        })
      }

      const listItems = tempDiv.querySelectorAll('li')
      appendPeriod(listItems)

      const paragraphs = tempDiv.querySelectorAll('p')
      appendPeriod(paragraphs)

      const textContent = tempDiv.textContent || tempDiv.innerText
      const content = parseHTML(textContent)
      return [model.title.concat('.'), ...segment(languageCode, content)]
    }

    return []
  }, [model, languageCode])

  useEffect(() => {
    tts.setSentences(sentences)
    return () => {
      tts.setSentences([])
    }
  }, [sentences, tts])

  useEffect(() => {
    const synth = window.speechSynthesis
    synth.cancel()
  }, [location.pathname])

  return {
    visible: tts.visible,
    setVisible: tts.setVisible,
    sentences: tts.sentences,
    setSentences: tts.setSentences,
  }
}

export default useTtsPlayer
