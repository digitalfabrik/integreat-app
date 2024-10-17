import { useContext, useEffect } from 'react'

import { ttsContext, TtsContextType } from '../components/TtsPlayer'

const useTtsPlayer = (content?: string, title?: string): TtsContextType => {
  const tts = useContext(ttsContext)

  useEffect(() => {
    if (content && title) {
      tts.setContent(content)
      tts.setTitle(title)
    }
    return () => {
      tts.setContent(null)
    }
  }, [content, title, tts])

  return {
    content: tts.content,
    setContent: tts.setContent,
    sentenceIndex: tts.sentenceIndex,
    setSentenceIndex: tts.setSentenceIndex,
    visible: tts.visible,
    setVisible: tts.setVisible,
    title: tts.title,
    setTitle: tts.setTitle,
    volume: tts.volume,
    setVolume: tts.setVolume,
  }
}

export default useTtsPlayer
