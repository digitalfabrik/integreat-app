import Speech, { type VoiceOptions } from '@mhpdev/react-native-speech'
import React, {
  createContext,
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, type EventSubscription } from 'react-native'

import { getGenericLanguageCode } from 'shared'

import buildConfig from '../constants/buildConfig'
import { AppContext } from '../contexts/AppContextProvider'
import useAppStateListener from '../hooks/useAppStateListener'
import useSnackbar from '../hooks/useSnackbar'
import { log, reportError } from '../utils/sentry'
import TtsPlayer from './TtsPlayer'

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

const IOS_SPEECH_RATE = 0.5
const DEFAULT_SPEECH_RATE = 1.0

const getTtsOptions = (languageCode: string): VoiceOptions => ({
  language: getGenericLanguageCode(languageCode),
  volume: 0.6,
  rate: Platform.OS === 'ios' ? IOS_SPEECH_RATE : DEFAULT_SPEECH_RATE,
  pitch: 1.0,
  silentMode: 'ignore',
})

const TtsContainer = ({ children }: TtsContainerProps): ReactElement => {
  const [voicesRetries, setVoicesRetries] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [sentenceIndex, setSentenceIndex] = useState(0)
  const [visible, setVisible] = useState(false)
  const [sentences, setSentences] = useState<string[]>([])
  const [voices, setVoices] = useState<{ language: string }[]>([])
  const { languageCode } = useContext(AppContext)
  const { t } = useTranslation('layout')
  const showSnackbar = useSnackbar()
  const title = sentences[0] || t('nothingToRead')
  const subscriptionsRef = useRef<EventSubscription[]>([])
  const enabled = buildConfig().featureFlags.tts

  const isLanguageSupported = voices.some(
    ({ language }) => getGenericLanguageCode(language) === getGenericLanguageCode(languageCode),
  )

  useEffect(() => {
    const loadVoices = async () => {
      try {
        const availableVoices = await Speech.getAvailableVoices()
        setVoices(availableVoices)
      } catch (error) {
        reportError(error)
        if (voicesRetries < 2) {
          log(`Failed to load voices, retry ${voicesRetries + 1}`, { level: 'warning' })
          setVoicesRetries(voicesRetries + 1)
        }
      }
    }

    loadVoices()
  }, [voicesRetries])

  const initializeTts = useCallback((): void => {
    Speech.initialize(getTtsOptions(languageCode))
  }, [languageCode])

  const showTtsPlayer = useCallback((): void => {
    if (!enabled || visible) {
      return
    }
    if (sentences.length === 0) {
      showSnackbar({ text: t('nothingToReadFullMessage') })
      return
    }
    if (!isLanguageSupported) {
      showSnackbar({ text: t('languageNotSupported') })
      reportError(new Error(`Language '${languageCode}' not supported`), { data: voices })
      return
    }

    try {
      initializeTts()
      setVisible(true)
    } catch (error) {
      reportError(error)
      showSnackbar({ text: t('error:unknownError') })
    }
  }, [initializeTts, enabled, sentences.length, visible, showSnackbar, t, isLanguageSupported, voices, languageCode])

  const stopPlayer = useCallback(async () => {
    subscriptionsRef.current.forEach(subscription => subscription.remove())
    subscriptionsRef.current = []
    await Speech.stop()

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

  const pause = useCallback(() => {
    Speech.pause()
      .catch(reportError)
      .finally(() => setIsPlaying(false))
  }, [])

  const play = useCallback(
    async (index = sentenceIndex) => {
      const safeIndex = Math.max(0, index)
      const sentence = sentences[safeIndex]
      if (sentence !== undefined) {
        try {
          const canResume = !isPlaying && subscriptionsRef.current.length > 0 && index === sentenceIndex

          if (canResume) {
            await Speech.resume()
            setIsPlaying(true)
          } else {
            await stopPlayer()
            const finishSubscription = Speech.onFinish(() => {
              play(safeIndex + 1)
            })

            const errorSubscription = Speech.onError(({ id }) => {
              log(`Speech error (ID: ${id})`, { level: 'error' })
              stop()
            })

            subscriptionsRef.current = [finishSubscription, errorSubscription]

            setIsPlaying(true)
            setSentenceIndex(safeIndex)

            await Speech.speakWithOptions(sentence, getTtsOptions(languageCode))
          }
        } catch (error) {
          reportError(error)
          stop()
        }
      } else {
        stop()
      }
    },
    [stop, stopPlayer, sentenceIndex, sentences, languageCode, isPlaying],
  )

  useAppStateListener(appState => {
    const movedAppToBackground = appState === 'inactive' || appState === 'background'
    if (movedAppToBackground && isPlaying) {
      stop()
    }
  })

  const close = useCallback(async () => {
    setVisible(false)
    stop()
  }, [stop])

  useEffect(() => {
    if (visible && !isLanguageSupported) {
      close()
    }
    return () => {
      subscriptionsRef.current.forEach(subscription => subscription.remove())
      subscriptionsRef.current = []
      Speech.stop().catch(reportError)
    }
  }, [visible, isLanguageSupported, close])

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
          disabled={sentences.length === 0}
          playPrevious={() => play(sentenceIndex - 1)}
          playNext={() => play(sentenceIndex + 1)}
          close={close}
          pause={pause}
          play={play}
          title={title}
        />
      )}
    </TtsContext.Provider>
  )
}

export default TtsContainer
