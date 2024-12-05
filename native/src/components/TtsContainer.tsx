import React, { createContext, ReactElement, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AppState } from 'react-native'
import Tts from 'react-native-tts'

import { truncate } from 'shared/utils/getExcerpt'

import buildConfig from '../constants/buildConfig'
import { AppContext } from '../contexts/AppContextProvider'
import { reportError } from '../utils/sentry'
import TtsPlayer from './TtsPlayer'

const MAX_TITLE_DISPLAY_CHARS = 20

export type TtsContextType = {
  enabled?: boolean
  visible: boolean
  setVisible: (visible: boolean) => void
  sentences: string[] | null
  setSentences: (sentences: string[]) => void
}

export const TtsContext = createContext<TtsContextType>({
  enabled: false,
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

  const initializeTts = useCallback((): void => {
    Tts.getInitStatus().catch(async error => {
      reportError(`Tts-Error: ${error.code}`)
      if (error.code === 'no_engine') {
        await Tts.requestInstallEngine().catch((e: string) => reportError(`Failed to install tts engine: : ${e}`))
      }
    })
  }, [])

  const enabled =
    Array.isArray(sentences) &&
    sentences.length > 0 &&
    Boolean(buildConfig().featureFlags.tts) &&
    !unsupportedLanguagesForTts.includes(languageCode)

  const play = useCallback(
    (index = sentenceIndex) => {
      Tts.stop()
      const sentence = sentences[index]
      if (sentence) {
        setIsPlaying(true)
        Tts.speak(sentence, {
          androidParams: {
            KEY_PARAM_PAN: 0,
            KEY_PARAM_VOLUME: 0.6,
            KEY_PARAM_STREAM: 'STREAM_MUSIC',
          },
          iosVoiceId: '',
          rate: 1,
        })
      }
    },
    [sentenceIndex, sentences],
  )

  const stop = async () => {
    setIsPlaying(false)
    setSentenceIndex(0)
    await Tts.stop()
    const TTS_STOP_DELAY = 100
    await new Promise(resolve => {
      setTimeout(resolve, TTS_STOP_DELAY)
    })
  }

  const pause = () => {
    Tts.stop()
    setIsPlaying(false)
  }

  const playNext = useCallback(
    (index = sentenceIndex) => {
      const nextIndex = index + 1
      if (nextIndex < sentences.length) {
        setSentenceIndex(nextIndex)
        play(nextIndex)
      } else {
        stop()
      }
    },
    [play, sentenceIndex, sentences.length],
  )

  const playPrevious = (index = sentenceIndex) => {
    const previousIndex = index - 1
    if (previousIndex >= 0) {
      setSentenceIndex(previousIndex)
      play(previousIndex)
    }
  }

  useEffect(() => {
    if (!enabled) {
      return () => undefined
    }

    initializeTts()
    Tts.addEventListener('tts-finish', () => playNext(sentenceIndex))

    return () => {
      Tts.removeAllListeners('tts-finish')
    }
  }, [enabled, initializeTts, playNext, sentenceIndex, sentences.length])

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

  const modifiedSetSentences = useCallback((newSentences: string[]) => {
    setSentences(newSentences)
    if (newSentences.length < 1) {
      stop()
    }
  }, [])

  const ttsContextValue = useMemo(
    () => ({
      enabled,
      sentenceIndex,
      visible,
      setVisible,
      sentences,
      setSentences: modifiedSetSentences,
      languageCode,
    }),
    [enabled, sentenceIndex, visible, sentences, modifiedSetSentences, languageCode],
  )

  return (
    <TtsContext.Provider value={ttsContextValue}>
      {children}
      {visible && (
        <TtsPlayer
          isPlaying={isPlaying}
          sentenceIndex={sentenceIndex}
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
