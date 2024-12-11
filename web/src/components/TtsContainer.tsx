import EasySpeech from 'easy-speech'
import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { truncate } from 'shared/utils/getExcerpt'

import buildConfig from '../constants/buildConfig'
import useTtsPlayer from '../hooks/useTtsPlayer'
import { reportError } from '../utils/sentry'
import TtsPlayer from './TtsPlayer'

const MAX_TITLE_DISPLAY_CHARS = 20

export const isTtsEnabled = (content: string[]): boolean =>
  Array.isArray(content) && content.length > 0 && buildConfig().featureFlags.tts

type TtsContainerProps = {
  languageCode: string
}

const TtsContainer = ({ languageCode }: TtsContainerProps): ReactElement | null => {
  const { t } = useTranslation('layout')
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const { sentences, setSentences, visible, setVisible } = useTtsPlayer()
  const [currentSentencesIndex, setCurrentSentenceIndex] = useState<number>(0)
  const [showHelpModal, setShowHelpModal] = useState(false)
  const allowIncrement = useRef(true)
  const title = sentences[0] || t('nothingToRead')
  const longTitle = truncate(title, { maxChars: MAX_TITLE_DISPLAY_CHARS })
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
  }

  useEffect(() => {
    if (!visible) {
      return
    }
    EasySpeech.init({ maxTimeout: 5000, interval: 250 }).catch(e => reportError(e))
  }, [visible])

  useEffect(() => {
    if (currentSentencesIndex + 1 >= sentences.length - 1) {
      resetOnEnd()
    }
  }, [currentSentencesIndex, sentences])

  const stop = () => {
    try {
      EasySpeech.cancel()
    } catch (_) {
      // setShowHelpModal(true)
    }
  }

  const play = async (index = currentSentencesIndex) => {
    try {
      stop()
      const voices = EasySpeech.voices()
      const selectedVoice = voices.find((voice: SpeechSynthesisVoice) => voice.lang.startsWith(languageCode))
      if (selectedVoice == null || EasySpeech.status().status === 'created') {
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
    } catch (_) {
      setShowHelpModal(true)
    }
  }

  const pause = () => {
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
    try {
      if (isPlaying) {
        pause()
      } else if (currentSentencesIndex !== 0 && !isAndroid) {
        setIsPlaying(true)
        EasySpeech.resume()
      } else {
        setIsPlaying(true)
        boundaryGuard(() => play())
      }
    } catch (_) {
      setShowHelpModal(true)
    }
  }

  const playNext = () => {
    const nextIndex = currentSentencesIndex + 1
    if (nextIndex < sentences.length) {
      setCurrentSentenceIndex(nextIndex)
      boundaryGuard(() => play(nextIndex))
    } else {
      stop()
    }
  }

  const playPrevious = () => {
    const previousIndex = currentSentencesIndex - 1
    if (previousIndex >= 0) {
      setCurrentSentenceIndex(previousIndex)
      boundaryGuard(() => play(previousIndex))
    }
  }

  const close = () => {
    setVisible(false)
    stop()
    setCurrentSentenceIndex(0)
    setIsPlaying(false)
  }
  return (
    <TtsPlayer
      playPrevious={playPrevious}
      close={close}
      playNext={playNext}
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
