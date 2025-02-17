import EasySpeech from 'easy-speech'
import React, { createContext, ReactElement, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { TTS_MAX_TITLE_DISPLAY_CHARS } from 'shared'
import { truncate } from 'shared/utils/getExcerpt'

import buildConfig from '../constants/buildConfig'
import useDetectBottomWhileScroll from '../hooks/useDetectBottomWhileScroll'
import { reportError } from '../utils/sentry'
import TtsPlayer from './TtsPlayer'

export type TtsContextType = {
  enabled?: boolean
  canRead: boolean
  visible: boolean
  setVisible: (visible: boolean) => void
  sentences: string[]
  setSentences: (sentences: string[]) => void
}

export const TtsContext = createContext<TtsContextType>({
  enabled: false,
  canRead: false,
  visible: false,
  setVisible: () => undefined,
  sentences: [],
  setSentences: () => undefined,
})

type TtsContainerProps = {
  languageCode: string
  children: ReactElement
}

const TtsContainer = ({ languageCode, children }: TtsContainerProps): ReactElement | null => {
  const { t } = useTranslation('layout')
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [visible, setVisible] = useState(false)
  const [sentences, setSentences] = useState<string[]>([])
  const [currentSentencesIndex, setCurrentSentenceIndex] = useState<number>(0)
  const [showHelpModal, setShowHelpModal] = useState(false)
  const title = sentences[0] || t('nothingToRead')
  const shortTitle = truncate(title, { maxChars: TTS_MAX_TITLE_DISPLAY_CHARS })
  const userAgent = navigator.userAgent.toLowerCase()
  const isAndroid = /android/i.test(userAgent)
  const isFirefoxAndLinux = userAgent.includes('firefox') && userAgent.includes('linux')
  const onEndGuard = useRef(true)
  const fallbackTimer = 1000
  const enabled = buildConfig().featureFlags.tts
  const canRead = enabled && sentences.length > 1
  const { isReachedBottom } = useDetectBottomWhileScroll()

  useEffect(() => {
    if (!enabled && !visible) {
      return
    }

    EasySpeech.init({ maxTimeout: 5000, interval: 250 }).catch(reportError)
  }, [enabled, visible])

  const resetOnEnd = () => {
    setCurrentSentenceIndex(0)
    setIsPlaying(false)
    onEndGuard.current = false
  }

  const stop = () => {
    try {
      EasySpeech.cancel()
      onEndGuard.current = false
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
        rate: 0.8,
        end: () => {
          if (onEndGuard.current) {
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

  const fallbackPlay = (index?: number) => {
    setTimeout(() => {
      // if paused at end of sentence and there is nothing to resume this should play
      if (!window.speechSynthesis.speaking && onEndGuard.current && isPlaying) {
        play(index)
      }
    }, fallbackTimer)
  }

  const pause = () => {
    onEndGuard.current = false
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
        onEndGuard.current = true
        EasySpeech.resume()

        fallbackPlay()
      } else {
        setIsPlaying(true)
        onEndGuard.current = true
        play()
        fallbackPlay()
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
      onEndGuard.current = true
      fallbackPlay(nextIndex)
    }
  }

  const playPrevious = async () => {
    const previousIndex = currentSentencesIndex - 1
    if (previousIndex >= 0) {
      setCurrentSentenceIndex(previousIndex)
      stop()
      await play(previousIndex)
      onEndGuard.current = true
      fallbackPlay(previousIndex)
    }
  }

  const close = () => {
    setVisible(false)
    stop()
    setCurrentSentenceIndex(0)
    setIsPlaying(false)
  }

  const ttsContextValue = useMemo(
    () => ({
      enabled,
      canRead,
      visible,
      setVisible,
      sentences,
      setSentences,
    }),
    [enabled, canRead, visible, sentences],
  )

  return (
    <TtsContext.Provider value={ttsContextValue}>
      {children}
      {visible && (
        <TtsPlayer
          playPrevious={playPrevious}
          close={close}
          playNext={playNext}
          isPlaying={isPlaying}
          setShowHelpModal={setShowHelpModal}
          showHelpModal={showHelpModal}
          togglePlayPause={togglePlayPause}
          title={shortTitle}
          isReachedBottom={isReachedBottom}
        />
      )}
    </TtsContext.Provider>
  )
}

export default TtsContainer
