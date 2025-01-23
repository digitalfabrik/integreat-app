import * as Speech from 'expo-speech'
import React, { createContext, ReactElement, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AppState } from 'react-native'

import { truncate } from 'shared/utils/getExcerpt'

import buildConfig from '../constants/buildConfig'
import { AppContext } from '../contexts/AppContextProvider'
import TtsPlayer from './TtsPlayer'

const MAX_TITLE_DISPLAY_CHARS = 20

export type TtsContextType = {
  enabled?: boolean
  canRead: boolean
  visible: boolean
  setVisible: (visible: boolean) => void
  sentences: string[] | null
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
  children: ReactElement
}

const TtsContainer = ({ children }: TtsContainerProps): ReactElement => {
  const { languageCode } = React.useContext(AppContext)
  const { t } = useTranslation('layout')
  const [isPlaying, setIsPlaying] = useState(false)
  const [sentenceIndex, setSentenceIndex] = useState(0)
  const [visible, setVisible] = useState(false)
  const [sentences, setSentences] = useState<string[]>([])
  const title = sentences[0] || t('nothingToRead')
  const longTitle = truncate(title, { maxChars: MAX_TITLE_DISPLAY_CHARS })
  const unsupportedLanguagesForTts = ['fa', 'ka', 'kmr']

  const enabled = buildConfig().featureFlags.tts && !unsupportedLanguagesForTts.includes(languageCode)
  const canRead = enabled && sentences.length > 0 // to check if content is available

  const play = useCallback(
    (index = sentenceIndex) => {
      Speech.stop()
      const sentence = sentences[index]
      if (sentence) {
        setIsPlaying(true)
        Speech.speak(sentence, {
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          onDone: () => handleNext(index),
          language: languageCode,
        })
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [languageCode, sentenceIndex, sentences],
  )

  const stop = async () => {
    setIsPlaying(false)
    setSentenceIndex(0)
    await Speech.stop()
    const TTS_STOP_DELAY = 100
    await new Promise(resolve => {
      setTimeout(resolve, TTS_STOP_DELAY)
    })
  }

  const handleNext = useCallback(
    (currentIndex: number) => {
      const nextIndex = currentIndex + 1
      if (nextIndex < sentences.length) {
        setSentenceIndex(nextIndex)
        play(nextIndex)
      } else {
        stop()
      }
    },
    [play, sentences.length],
  )

  const pause = () => {
    Speech.stop()
    setIsPlaying(false)
  }

  const playNext = useCallback(() => {
    setSentenceIndex(prevIndex => {
      handleNext(prevIndex)
      return prevIndex + 1
    })
  }, [handleNext])

  const playPrevious = () => {
    const previousIndex = Math.max(0, sentenceIndex - 1)
    setSentenceIndex(previousIndex)
    play(previousIndex)
  }

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'inactive' || nextAppState === 'background') {
        stop()
      }
    })

    return subscription.remove
  }, [])

  const close = async () => {
    setVisible(false)
    await stop()
  }

  const updateSentences = useCallback((newSentences: string[]) => {
    setSentences(newSentences)
    stop()
  }, [])

  const ttsContextValue = useMemo(
    () => ({
      enabled,
      canRead,
      visible,
      setVisible,
      sentences,
      setSentences: updateSentences,
    }),
    [enabled, canRead, visible, sentences, updateSentences],
  )

  return (
    <TtsContext.Provider value={ttsContextValue}>
      {children}
      {visible && (
        <TtsPlayer
          isPlaying={isPlaying}
          sentences={sentences}
          playPrevious={playPrevious}
          playNext={playNext}
          close={close}
          pause={pause}
          play={play}
          title={longTitle}
        />
      )}
    </TtsContext.Provider>
  )
}

export default TtsContainer
