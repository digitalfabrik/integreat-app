import { useContext } from 'react'

import { ttsContext, ttsContextType } from '../components/TtsPlayer'

const useTtsPlayer = (): ttsContextType => {
  const tts = useContext(ttsContext)

  return {
    content: tts.content,
    setContent: tts.setContent,
    sentenceIndex: tts.sentenceIndex,
    setSentenceIndex: tts.setSentenceIndex,
    visible: tts.visible,
    setVisible: tts.setVisible,
    title: tts.title,
    setTitle: tts.setTitle,
  }
}

export default useTtsPlayer
