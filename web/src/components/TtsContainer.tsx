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
  const title = sentences[0] || t('nothingToRead')
  const longTitle = truncate(title, { maxChars: MAX_TITLE_DISPLAY_CHARS })
  const userAgent = navigator.userAgent
  const isAndroid = Boolean(/android/i.test(userAgent))
  const isFirefox = userAgent.toLowerCase().includes('firefox')
  const isLinux = userAgent.toLowerCase().includes('linux')
  const isFirefoxAndLinux = isFirefox && isLinux
  const enableOnEnd = useRef(true)
  const msTime = 1000

  const resetOnEnd = () => {
    setCurrentSentenceIndex(0)
    setIsPlaying(false)
    enableOnEnd.current = false
  }

  useEffect(() => {
    if (!visible) {
      return
    }

    EasySpeech.init({ maxTimeout: 5000, interval: 250 }).catch(reportError)
  }, [visible])

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

  const playOnFallback = () =>
    setTimeout(() => {
      // if paused at end of sentence and there is nothing to resume this should play
      if (!window.speechSynthesis.speaking && enableOnEnd.current && !isPlaying) {
        play()
      }
    }, msTime)

  const pause = () => {
    enableOnEnd.current = false
    EasySpeech.pause()
    setIsPlaying(false)
  }

  const togglePlayPause = () => {
    try {
      if (isPlaying) {
        if (isFirefoxAndLinux) {
          stop()
        }
        pause()
      } else if (currentSentencesIndex !== 0 && !isAndroid && !isFirefoxAndLinux) {
        // FirefoxAndLinux and isAndroid can't resume
        setIsPlaying(true)
        enableOnEnd.current = true
        EasySpeech.resume()

        playOnFallback()
      } else {
        setIsPlaying(true)
        enableOnEnd.current = true
        play()
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
      playOnFallback()
    }
  }

  const playPrevious = async () => {
    const previousIndex = currentSentencesIndex - 1
    if (previousIndex >= 0) {
      setCurrentSentenceIndex(previousIndex)
      stop()
      await play(previousIndex)
      enableOnEnd.current = true
      playOnFallback()
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
