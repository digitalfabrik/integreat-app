import EasySpeech from 'easy-speech'
import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { MAX_TITLE_DISPLAY_CHARS } from 'shared'
import { truncate } from 'shared/utils/getExcerpt'

import useTtsPlayer from '../hooks/useTtsPlayer'
import { reportError } from '../utils/sentry'
import TtsPlayer from './TtsPlayer'

type TtsContainerProps = {
  languageCode: string
}

const TtsContainer = ({ languageCode }: TtsContainerProps): ReactElement | null => {
  const { t } = useTranslation('layout')
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const { sentences, setSentences, visible, setVisible, enabled } = useTtsPlayer()
  const [currentSentencesIndex, setCurrentSentenceIndex] = useState<number>(0)
  const [showHelpModal, setShowHelpModal] = useState(false)
  const title = sentences[0] || t('nothingToRead')
  const shortTitle = truncate(title, { maxChars: MAX_TITLE_DISPLAY_CHARS })
  const userAgent = navigator.userAgent.toLowerCase()
  const isAndroid = /android/i.test(userAgent)
  const isFirefox = userAgent.includes('firefox')
  const isLinux = userAgent.includes('linux')
  const isFirefoxAndLinux = isFirefox && isLinux
  const enableOnEnd = useRef(true)
  const fallbackTimer = 1000

  useEffect(() => {
    if (!enabled && !visible) {
      return
    }

    EasySpeech.init({ maxTimeout: 5000, interval: 250 }).catch(reportError)
  }, [enabled, visible])

  const resetOnEnd = () => {
    setCurrentSentenceIndex(0)
    setIsPlaying(false)
    enableOnEnd.current = false
  }

  const stop = () => {
    try {
      EasySpeech.cancel()
      enableOnEnd.current = false
    } catch (e) {
      reportError(e)
    }
  }

  const play = async (index = currentSentencesIndex) => {
    try {
      const voices = EasySpeech.voices()
      const selectedVoice = voices.find((voice: SpeechSynthesisVoice) => voice.lang.startsWith(languageCode))

      if (selectedVoice == null || EasySpeech.status().status === 'created') {
        setSentences([])
        setShowHelpModal(true)
        return
      }

      await EasySpeech.speak({
        text: String(sentences[index]),
        voice: selectedVoice,
        volume: 0.6,
        end: () => {
          if (enableOnEnd.current) {
            setCurrentSentenceIndex((prevIndex: number) => {
              const newIndex = prevIndex + 1
              if (newIndex < sentences.length - 1) {
                play(newIndex)
              } else {
                resetOnEnd()
                stop()
              }
              return newIndex
            })
          }
        },
      }).catch(() => null) // at chrome this will throw interrupted errors
    } catch (_) {
      setShowHelpModal(true)
    }
  }

  const playOnFallback = (index?: number) => {
    setTimeout(() => {
      // if paused at end of sentence and there is nothing to resume this should play
      if (!window.speechSynthesis.speaking && enableOnEnd.current && isPlaying) {
        play(index)
      }
    }, fallbackTimer)
  }

  const pause = () => {
    enableOnEnd.current = false
    EasySpeech.pause()
    setIsPlaying(false)
  }

  const togglePlayPause = () => {
    try {
      const canResume = currentSentencesIndex !== 0 && !isAndroid && !isFirefoxAndLinux
      if (isPlaying) {
        if (isFirefoxAndLinux) {
          stop()
        }
        pause()
      } else if (canResume) {
        setIsPlaying(true)
        enableOnEnd.current = true
        EasySpeech.resume()

        playOnFallback()
      } else {
        setIsPlaying(true)
        enableOnEnd.current = true
        play()
        playOnFallback()
      }
    } catch (_) {
      setShowHelpModal(true)
    }
  }

  const playNext = async () => {
    const nextIndex = currentSentencesIndex + 1
    if (nextIndex < sentences.length) {
      setCurrentSentenceIndex(nextIndex)
      stop()
      await play(nextIndex)
      enableOnEnd.current = true
      playOnFallback(nextIndex)
    }
  }

  const playPrevious = async () => {
    const previousIndex = currentSentencesIndex - 1
    if (previousIndex >= 0) {
      setCurrentSentenceIndex(previousIndex)
      stop()
      await play(previousIndex)
      enableOnEnd.current = true
      playOnFallback(previousIndex)
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
      title={shortTitle}
    />
  )
}

export default TtsContainer
