import React, { createContext, ReactElement, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AppState, Platform } from 'react-native'
import Tts from 'react-native-tts'

import { truncate } from 'shared/utils/getExcerpt'

import buildConfig from '../constants/buildConfig'
import { AppContext } from '../contexts/AppContextProvider'
import { reportError } from '../utils/sentry'
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
// TODO Sometimes on ios when clicking playNext it reads the sentences and stop.
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
  const [suppressFinishEvent, setSuppressFinishEvent] = useState(false)

  const initializeTts = useCallback((): void => {
    Tts.getInitStatus().catch(async error => {
      reportError(`Tts-Error: ${error.code}`)
      if (error.code === 'no_engine') {
        await Tts.requestInstallEngine().catch((e: string) => reportError(`Failed to install tts engine: : ${e}`))
      }
    })
  }, [])

  /** Since ios wrongly triggers internally the tts-finish event even on stop() that should trigger 'tts-cancel' we have to suppress it, because it would trigger the playNext function
   * https://github.com/ak1394/react-native-tts/issues/256
   */
  const suppressFinishEventOnIos = () => {
    if (Platform.OS === 'ios') {
      setSuppressFinishEvent(true)
    }
  }

  // TODO fix on nextPlay and onPreviousPlay stops after reading sentence

  const enabled = buildConfig().featureFlags.tts && !unsupportedLanguagesForTts.includes(languageCode)
  const canRead = enabled && sentences.length > 0 // to check if content is available

  const play = useCallback(
    (index = sentenceIndex) => {
      if (suppressFinishEvent) {
        setSuppressFinishEvent(false)
      }

      const sentence = sentences[index]
      if (sentence) {
        Tts.setDefaultLanguage(languageCode).then()
        Tts.speak(sentence, {
          androidParams: {
            KEY_PARAM_PAN: 0,
            KEY_PARAM_VOLUME: 1,
            KEY_PARAM_STREAM: 'STREAM_MUSIC',
          },
          iosVoiceId: '',
          rate: 0.45,
        })
        setIsPlaying(true)
      }
    },
    [languageCode, sentenceIndex, sentences, suppressFinishEvent],
  )

  const stop = useCallback(async (resetIndex = false) => {
    suppressFinishEventOnIos()
    Tts.stop()
    setIsPlaying(false)
    await new Promise(resolve => {
      const TTS_STOP_DELAY = 100
      setTimeout(resolve, TTS_STOP_DELAY)
    })
    if (resetIndex) {
      setSentenceIndex(0)
    }
  }, [])

  const playNextAutomatic = useCallback(() => {
    const nextIndex = sentenceIndex + 1
    if (nextIndex < sentences.length) {
      setSentenceIndex(nextIndex)
      play(nextIndex)
    } else {
      stop(true).then()
    }
  }, [play, sentenceIndex, sentences.length, stop])

  const playNext = useCallback(() => {
    const nextIndex = sentenceIndex + 1
    if (nextIndex < sentences.length) {
      suppressFinishEventOnIos()
      setSentenceIndex(nextIndex)
      Tts.stop().then()
      play(nextIndex)
    } else {
      stop(true).then()
    }
  }, [play, sentenceIndex, sentences.length, stop])

  const playPrevious = () => {
    suppressFinishEventOnIos()
    const previousIndex = Math.max(0, sentenceIndex - 1)
    setSentenceIndex(previousIndex)
    Tts.stop().then()
    play(previousIndex)
  }

  useEffect(() => {
    if (!enabled) {
      return () => undefined
    }

    initializeTts()
    return () => undefined
  }, [enabled, initializeTts])

  useEffect(() => {
    Tts.addEventListener('tts-finish', () => {
      if (!suppressFinishEvent) {
        playNextAutomatic()
      }
    })

    return () => Tts.removeAllListeners('tts-finish')
  }, [playNextAutomatic, suppressFinishEvent])

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'inactive' || nextAppState === 'background') {
        stop(true).then()
      }
    })

    return subscription.remove
  }, [stop])

  const close = async () => {
    setVisible(false)
    stop(true)
  }

  const updateSentences = useCallback(
    (newSentences: string[]) => {
      setSentences(newSentences)
      stop(true).then()
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
          playPrevious={playPrevious}
          playNext={playNext}
          close={close}
          pause={stop}
          play={play}
          title={longTitle}
        />
      )}
    </TtsContext.Provider>
  )
}

export default TtsContainer
