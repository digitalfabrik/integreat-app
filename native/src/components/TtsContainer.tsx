import React, { createContext, ReactElement, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AppState } from 'react-native'
import Tts, { Options } from 'react-native-tts'

import { truncate } from 'shared/utils/getExcerpt'

import buildConfig from '../constants/buildConfig'
import { AppContext } from '../contexts/AppContextProvider'
import useAppStateListener from '../hooks/useAppStateListener'
import { reportError } from '../utils/sentry'
import TtsPlayer from './TtsPlayer'

const MAX_TITLE_DISPLAY_CHARS = 20
const TTS_UNSUPPORTED_LANGUAGES = ['fa', 'ka', 'kmr']
const TTS_OPTIONS: Options = {
  androidParams: {
    KEY_PARAM_PAN: 0,
    KEY_PARAM_VOLUME: 0.6,
    KEY_PARAM_STREAM: 'STREAM_MUSIC',
  },
  iosVoiceId: '',
  // This must not be 1 on iOS
  rate: 0.5,
}

export type TtsContextType = {
  enabled: boolean
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
  const [isPlaying, setIsPlaying] = useState(false)
  const [sentenceIndex, setSentenceIndex] = useState(0)
  const [visible, setVisible] = useState(false)
  const [sentences, setSentences] = useState<string[]>([])
  const { languageCode } = useContext(AppContext)
  const { t } = useTranslation('layout')
  const title = sentences[0] || t('nothingToRead')
  const longTitle = truncate(title, { maxChars: MAX_TITLE_DISPLAY_CHARS })
  const enabled = buildConfig().featureFlags.tts && !TTS_UNSUPPORTED_LANGUAGES.includes(languageCode)
  const canRead = enabled && sentences.length > 0

  const initializeTts = useCallback((): void => {
    Tts.getInitStatus()
      .then(() => Tts.setDefaultLanguage(languageCode))
      .catch(async error => {
        if (error.code === 'no_engine') {
          await Tts.requestInstallEngine().catch((e: string) => reportError(`Failed to install tts engine: : ${e}`))
        } else {
          reportError(`Tts-Error: ${error.code}`)
        }
      })
  }, [languageCode])

  const stop = useCallback(async (resetSentenceIndex = true) => {
    // iOS wrongly sends tts-finish instead of tts-cancel if calling Tts.stop()
    // We therefore have to remove the listener before stopping to avoid playing the next sentence
    // https://github.com/ak1394/react-native-tts/issues/198
    Tts.removeAllListeners('tts-finish')
    // Add a listener doing nothing to avoid warnings about unhandled events
    Tts.addEventListener('tts-finish', () => undefined)
    await Tts.stop()
    setIsPlaying(false)
    if (resetSentenceIndex) {
      setSentenceIndex(0)
    }
    // The tts-finish event is only fired some time after stop is finished
    // We therefore need to wait some time before adding the listener again
    await new Promise(resolve => {
      const ttsStopDelay = 100
      setTimeout(resolve, ttsStopDelay)
    })
  }, [])

  const play = useCallback(
    async (index = sentenceIndex) => {
      await stop()
      const sentence = sentences[index]
      if (sentence) {
        setIsPlaying(true)
        setSentenceIndex(index)
        Tts.addEventListener('tts-finish', () => play(index + 1))
        Tts.speak(sentence, TTS_OPTIONS)
      }
    },
    [stop, sentenceIndex, sentences],
  )

  useEffect(() => {
    if (visible) {
      initializeTts()
    }
  }, [visible, initializeTts])

  useAppStateListener(appState => {
    if (appState === 'inactive' || appState === 'background') {
      stop().catch(reportError)
    }
  })

  const close = async () => {
    setVisible(false)
    stop().catch(reportError)
  }

  const updateSentences = useCallback(
    (newSentences: string[]) => {
      setSentences(newSentences)
      stop().catch(reportError)
    },
    [stop],
  )

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
          playPrevious={() => play(sentenceIndex - 1)}
          playNext={() => play(sentenceIndex + 1)}
          close={close}
          pause={() => stop(false)}
          play={play}
          title={longTitle}
        />
      )}
    </TtsContext.Provider>
  )
}

export default TtsContainer
