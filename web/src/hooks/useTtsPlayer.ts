import { useContext, useEffect } from 'react'

import { ttsContext, TtsContextType } from '../contexts/TtsContextProvider'

const useTtsPlayer = (content?: string, title?: string): TtsContextType => {
  const tts = useContext(ttsContext)

  useEffect(() => {
    if (content && title) {
      tts.setContent(content)
      tts.setTitle(title)
    }
    return () => {
      tts.setContent('')
    }
  }, [content, title, tts])

  return {
    content: tts.content,
    setContent: tts.setContent,
    visible: tts.visible,
    setVisible: tts.setVisible,
    title: tts.title,
    setTitle: tts.setTitle,
    volume: tts.volume,
    setVolume: tts.setVolume,
  }
}

export default useTtsPlayer
