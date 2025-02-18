import React, { createContext, ReactElement, useCallback, useContext, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Tts, { Options } from 'react-native-tts'

import { truncate } from 'shared/utils/getExcerpt'

import buildConfig from '../constants/buildConfig'
import { AppContext } from '../contexts/AppContextProvider'
import useAppStateListener from '../hooks/useAppStateListener'
import useSnackbar from '../hooks/useSnackbar'
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
  visible: boolean
  showTtsPlayer: () => void
  sentences: string[]
  setSentences: (sentences: string[]) => void
}

export const TtsContext = createContext<TtsContextType>({
  enabled: false,
  visible: false,
  showTtsPlayer: () => undefined,
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
  const showSnackbar = useSnackbar()
  const title = sentences[0] || t('nothingToRead')
  const longTitle = truncate(title, { maxChars: MAX_TITLE_DISPLAY_CHARS })
  const enabled = buildConfig().featureFlags.tts && !TTS_UNSUPPORTED_LANGUAGES.includes(languageCode)

  const initializeTts = useCallback(async (): Promise<void> => {
    await Tts.getInitStatus().catch(async error =>
      error.code === 'no_engine' ? Tts.requestInstallEngine() : undefined,
    )
  }, [])

  const showTtsPlayer = useCallback((): void => {
    if (!enabled || visible) {
      return
    }
    if (sentences.length === 0) {
      showSnackbar({ text: t('nothingToReadFullMessage') })
      return
    }
    initializeTts()
      .then(() => setVisible(true))
      .catch(error => {
        reportError(error)
        showSnackbar({ text: t('error:unknownError') })
      })
  }, [initializeTts, enabled, sentences.length, visible, showSnackbar, t])

  const stopPlayer = useCallback(async () => {
    // iOS wrongly sends tts-finish instead of tts-cancel if calling Tts.stop()
    // We therefore have to remove the listener before stopping to avoid playing the next sentence
    // https://github.com/ak1394/react-native-tts/issues/198
    Tts.removeAllListeners('tts-finish')
    // Add a listener doing nothing to avoid warnings about unhandled events
    Tts.addEventListener('tts-finish', () => undefined)
    await Tts.stop()
    // The tts-finish event is only fired some time after stop is finished
    // We therefore need to wait some time before adding the listener again
    await new Promise(resolve => {
      const ttsStopDelay = 100
      setTimeout(resolve, ttsStopDelay)
    })
  }, [])

  const stop = useCallback(() => {
    stopPlayer().catch(reportError)
    setIsPlaying(false)
    setSentenceIndex(0)
  }, [stopPlayer])

  const pause = () => {
    stopPlayer().catch(reportError)
    setIsPlaying(false)
  }

  const play = useCallback(
    async (index = sentenceIndex) => {
      const safeIndex = Math.max(0, index)
      const sentence = sentences[safeIndex]
      if (sentence) {
        await stopPlayer()
        setIsPlaying(true)
        setSentenceIndex(safeIndex)
        Tts.addEventListener('tts-finish', () => play(safeIndex + 1))
        Tts.setDefaultLanguage(languageCode)
        Tts.speak(sentence, TTS_OPTIONS)
      } else {
        stop()
      }
    },
    [stop, stopPlayer, sentenceIndex, sentences, languageCode],
  )

  useAppStateListener(appState => {
    const movedAppToBackground = appState === 'inactive' || appState === 'background'
    if (movedAppToBackground && isPlaying) {
      stop()
    }
  })

  const close = async () => {
    setVisible(false)
    stop()
  }

  const updateSentences = useCallback(
    (newSentences: string[]) => {
      setSentences(newSentences)
      stop()
    },
    [stop],
  )

  const ttsContextValue = useMemo(
    () => ({
      enabled,
      visible,
      showTtsPlayer,
      sentences,
      setSentences: updateSentences,
    }),
    [enabled, visible, sentences, updateSentences, showTtsPlayer],
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
          pause={pause}
          play={play}
          title={longTitle}
        />
      )}
    </TtsContext.Provider>
  )
}

export default TtsContainer
