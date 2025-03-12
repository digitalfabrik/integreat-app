import EasySpeech from 'easy-speech'
import React, { createContext, ReactElement, useCallback, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { TTS_MAX_TITLE_DISPLAY_CHARS } from 'shared'
import { truncate } from 'shared/utils/getExcerpt'

import buildConfig from '../constants/buildConfig'
import TtsHelpModal from './TtsHelpModal'
import TtsPlayer from './TtsPlayer'

export type TtsContextType = {
  enabled?: boolean
  canRead: boolean
  visible: boolean
  showTtsPlayer: () => void
  sentences: string[]
  setSentences: (sentences: string[]) => void
}

export const TtsContext = createContext<TtsContextType>({
  enabled: false,
  canRead: false,
  visible: false,
  showTtsPlayer: () => undefined,
  sentences: [],
  setSentences: () => undefined,
})

const initializedStatus = ['init: failed', 'created']
const ttsInitialized = () => !initializedStatus.some(status => EasySpeech.status().status.includes(status))

type TtsContainerProps = {
  languageCode: string
  children: ReactElement
}

const TtsContainer = ({ languageCode, children }: TtsContainerProps): ReactElement | null => {
  const { t } = useTranslation('layout')
  const afterStopRef = useRef<(() => void) | null>(null)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [visible, setVisible] = useState(false)
  const [sentences, setSentences] = useState<string[]>([])
  const [sentenceIndex, setSentenceIndex] = useState(0)
  const [showHelpModal, setShowHelpModal] = useState(false)
  const title = sentences[0] || t('nothingToRead')
  const shortTitle = truncate(title, { maxChars: TTS_MAX_TITLE_DISPLAY_CHARS })
  const enabled = buildConfig().featureFlags.tts
  const canRead = enabled && sentences.length > 1

  const initializeTts = useCallback(() => {
    if (buildConfig().featureFlags.tts) {
      EasySpeech.init({ maxTimeout: 500, interval: 250 })
        .then(() => setVisible(true))
        .catch(() => setShowHelpModal(true))
    }
  }, [])

  const stopPlayer = useCallback((afterStop: () => void = () => undefined) => {
    if (ttsInitialized()) {
      // The end event is always emitted if the current utterance is stopped (incl. finish, cancel and pause)
      // The end event is only emitted after some time, such that we can only start the next utterance after to avoid autoplaying the next utterance
      // https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance/end_event
      afterStopRef.current = afterStop
      EasySpeech.cancel()
    }
  }, [])

  const stop = useCallback(() => {
    setSentenceIndex(0)
    setIsPlaying(false)
    stopPlayer()
  }, [stopPlayer])

  const pause = () => {
    setIsPlaying(false)
    stopPlayer()
  }

  const play = useCallback(
    async (index = sentenceIndex) => {
      const voice = ttsInitialized() ? EasySpeech.voices().find(voice => voice.lang.startsWith(languageCode)) : null
      if (!voice) {
        setShowHelpModal(true)
        return
      }

      const safeIndex = Math.max(0, index)
      const sentence = sentences[safeIndex]

      if (!sentence) {
        stop()
        return
      }

      setSentenceIndex(safeIndex)

      try {
        setIsPlaying(true)
        await EasySpeech.speak({
          text: sentence,
          voice,
          volume: 0.6,
          rate: 0.8,
          end: () => {
            // We only want to play the next sentence if the current utterance is finished and the user did not stop it manually
            // Otherwise, execute afterStop (play previous or next sentence for playPrevious/Next or noop for stop)
            if (afterStopRef.current) {
              afterStopRef.current()
              afterStopRef.current = null
            } else {
              play(safeIndex + 1)
            }
          },
        })
      } catch (e) {
        // Chrome throws an interrupted error event on cancel instead of emitting an end event
        if (e instanceof SpeechSynthesisErrorEvent && e.error === 'interrupted') {
          if (afterStopRef.current) {
            afterStopRef.current()
            afterStopRef.current = null
          }
        } else {
          reportError(e)
        }
      }
    },
    [sentenceIndex, setIsPlaying, sentences, stop, languageCode],
  )

  const close = () => {
    setVisible(false)
    setShowHelpModal(false)
    stop()
  }

  const playPrevious = () => stopPlayer(() => play(sentenceIndex - 1))
  const playNext = () => stopPlayer(() => play(sentenceIndex + 1))

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
      canRead,
      visible,
      showTtsPlayer: initializeTts,
      sentences,
      setSentences: updateSentences,
    }),
    [enabled, canRead, visible, sentences, updateSentences, initializeTts],
  )

  return (
    <TtsContext.Provider value={ttsContextValue}>
      {children}
      {showHelpModal && <TtsHelpModal closeModal={close} />}
      {visible && (
        <TtsPlayer
          disabled={sentences.length === 0}
          close={close}
          playPrevious={playPrevious}
          playNext={playNext}
          isPlaying={isPlaying}
          pause={pause}
          play={() => play()}
          title={shortTitle}
        />
      )}
    </TtsContext.Provider>
  )
}

export default TtsContainer
