import EasySpeech from 'easy-speech'
import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import buildConfig from '../constants/buildConfig'
import useTtsPlayer from '../hooks/useTtsPlayer'
import TtsPlayer from './TtsPlayer'

export const isTtsEnabled = (content: string[]): boolean =>
  Array.isArray(content) && content.length > 0 && buildConfig().featureFlags.tts

type TtsContainerProps = {
  languageCode: string
}

const TtsContainer = ({ languageCode }: TtsContainerProps): ReactElement | null => {
  const { t } = useTranslation('layout')
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const { sentences, setSentences, title, visible, setVisible } = useTtsPlayer()
  const [currentSentencesIndex, setCurrentSentenceIndex] = useState<number>(0)
  const [showHelpModal, setShowHelpModal] = useState(false)
  const numOfSentencesToSkip = 1
  const allowIncrement = useRef(true)
  const maxTitle = 20
  const longTitle = title.length > maxTitle ? title.substring(0, maxTitle).concat('...') : title || t('readAloud')
  const userAgent = navigator.userAgent
  const isAndroid = Boolean(/android/i.test(userAgent))
  const isFirefox = userAgent.toLowerCase().includes('firefox')

  const handleBoundary = (event: SpeechSynthesisEvent) => {
    if (event.name === 'sentence' && allowIncrement.current) {
      setCurrentSentenceIndex((prevIndex: number) => prevIndex + 1)
    }
    allowIncrement.current = true
  }

  const resetOnEnd = () => {
    setCurrentSentenceIndex(0)
    setIsPlaying(false)
    setIsExpanded(false)
  }

  useEffect(() => {
    EasySpeech.init({ maxTimeout: 5000, interval: 250 }).catch(e => reportError(e))
  }, [])

  useEffect(() => {
    if (currentSentencesIndex + 1 >= sentences.length - 1) {
      resetOnEnd()
    }
  }, [currentSentencesIndex, sentences])

  const startReading = async (index = currentSentencesIndex) => {
    EasySpeech.cancel()
    const voices = EasySpeech.voices()
    const selectedVoice = voices.find((voice: SpeechSynthesisVoice) => voice.lang.startsWith(languageCode))
    if (selectedVoice == null) {
      setSentences([])
      setShowHelpModal(true)
      return
    }

    await EasySpeech.speak({
      text: sentences.slice(index).join(' '),
      voice: selectedVoice,
      pitch: 1,
      rate: 1,
      volume: 0.6,
      boundary: e => handleBoundary(e),
      end: () => {
        if (!isFirefox) {
          resetOnEnd()
        }
      },
    }).catch(() => null)
  }

  const pauseReading = () => {
    EasySpeech.pause()
    setIsPlaying(false)
  }

  const boundaryGuard = async (action: () => Promise<void>) => {
    allowIncrement.current = true
    try {
      await action()
    } finally {
      allowIncrement.current = false
    }
  }

  const togglePlayPause = () => {
    if (isPlaying) {
      pauseReading()
    } else if (currentSentencesIndex !== 0 && !isAndroid) {
      setIsPlaying(true)
      EasySpeech.resume()
    } else {
      setIsPlaying(true)
      boundaryGuard(() => startReading())
    }
    setIsExpanded(!isPlaying)
  }

  const handleForward = () => {
    if (isPlaying) {
      EasySpeech.cancel()
    }
    setCurrentSentenceIndex(prevIndex => {
      const newIndex = Math.min(prevIndex + numOfSentencesToSkip, sentences.length - 1)
      boundaryGuard(() => startReading(newIndex))
      return newIndex
    })
  }

  const handleBackward = () => {
    if (isPlaying) {
      EasySpeech.cancel()
    }
    setCurrentSentenceIndex(prevIndex => {
      const newIndex = Math.max(0, prevIndex - numOfSentencesToSkip)
      boundaryGuard(() => startReading(newIndex))
      return newIndex
    })
  }

  const handleClose = () => {
    setVisible(false)
    setIsExpanded(false)
    EasySpeech.cancel()
    setCurrentSentenceIndex(0)
    setIsPlaying(false)
  }
  return (
    <TtsPlayer
      handleBackward={handleBackward}
      handleClose={handleClose}
      handleForward={handleForward}
      isExpanded={isExpanded}
      isPlaying={isPlaying}
      isVisible={visible}
      setShowHelpModal={setShowHelpModal}
      showHelpModal={showHelpModal}
      togglePlayPause={togglePlayPause}
      longTitle={longTitle}
    />
  )
}

export default TtsContainer
