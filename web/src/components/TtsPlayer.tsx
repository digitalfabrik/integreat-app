import React, { createContext, ReactElement, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { CloseIcon, NoSoundIcon, PauseIcon, PlaybackIcon, PlayIcon, SoundIcon } from '../assets'
import Button from './base/Button'
import Icon from './base/Icon'

const StyledTtsPlayer = styled.div<{ $isPlaying: boolean }>`
  background-color: #dedede;
  border-radius: 28px;
  width: 85%;
  display: flex;
  flex-direction: ${props => (props.$isPlaying ? 'column' : 'row')};
  justify-content: center;
  align-items: center;
  align-self: center;
  padding: 6px;
  position: absolute;
  bottom: 5px;
  min-height: 93px;
  gap: ${props => (props.$isPlaying ? '5px;' : '10px')};
`
const StyledPanel = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
  padding: 0 10px;
`
const StyledPlayIcon = styled(Button)`
  background-color: #232323;
  width: 50px;
  height: 50px;
  border-radius: 50px;
`

const StyledBackForthButton = styled(Button)`
  display: flex;
  flex-direction: row;
  gap: 5px;
  align-items: flex-end;
`

const PlayButtonIcon = styled(Icon)`
  color: #dedede;
`

const BackForthIcon = styled(Icon)<{ $flip: boolean }>`
  transform: ${props => (props.$flip ? 'scaleX(-1)' : '')};
`

const StyledText = styled.span`
  font-weight: bold;
`

const StyledPlayerHeaderText = styled.span`
  font-weight: 600;
  align-self: center;
  font-size: 18px;
`

const CloseButton = styled(Button)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 7px;
  background-color: ${props => props.theme.colors.themeColor};
  padding: 5px;
  gap: 5px;
  width: 176px;
`

const CloseView = styled.div`
  flex-direction: column;
  gap: 10px;
`

export type ttsContextType = {
  visible: boolean
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
  title: string
  setTitle: React.Dispatch<React.SetStateAction<string>>
  volume: number
  setVolume: React.Dispatch<React.SetStateAction<number>>
}
export const ttsContext = createContext<ttsContextType>({
  visible: false,
  setVisible: () => {
    // setVisible
  },
  title: '',
  setTitle: () => {
    // setTitle
  },
  volume: 50,
  setVolume: () => {
    // setVolume
  },
})

type TtsPlayerProps = {
  children: ReactElement
  initialVisibility?: boolean
}
const TtsPlayer = ({ initialVisibility = false, children }: TtsPlayerProps): ReactElement | null => {
  //   const { languageCode } = useContext(AppContext)
  const { t } = useTranslation('layout')
  const [isPlaying, setIsPlaying] = useState(false)
  const [expandPlayer, setExpandPlayer] = useState(false)
  const defaultVolume = 50
  const [volume, setVolume] = useState(defaultVolume)
  //   const [sentenceIndex, setSentenceIndex] = useState(0)
  //   const [content, setContent] = useState<string | null>(null)
  const [visible, setVisible] = useState(initialVisibility)
  const [title, setTitle] = useState('')
  //   const sentences: string[] | [] = useMemo(
  //     () => (content ? [title, ...extractSentencesFromHtml(content)] : []),
  //     [title, content],
  //   )

  //   const isPersian = languageCode === 'fa'

  //   const initializeTts = useCallback((): void => {
  //     Tts.getInitStatus()
  //       .then(async (status: string) => {
  //         // Status does not have to be 'success'
  //         if (status === 'success') {
  //           // await Tts.setDefaultLanguage('de-DE')
  //         }
  //       })
  //       .catch(async error => {
  //         /* eslint-disable-next-line no-console */
  //         console.error(`Tts-Error: ${error.code}`)
  //         if (error.code === 'no_engine') {
  //           /* eslint-disable-next-line no-console */
  //           await Tts.requestInstallEngine().catch((e: string) => console.error('Failed to install tts engine: ', e))
  //         }
  //       })
  //   }, [])

  const stopTts = async () => {
    // await Tts.stop()
    // const TTS_STOP_DELAY = 100 // delay to make sure tts is stopped
    // await new Promise(resolve => {
    //   setTimeout(resolve, TTS_STOP_DELAY)
    // })
  }

  const startReading = () => {
    // if (!isPersian && sentences.length > 0) {
    //   // Persian not supported
    //   setIsPlaying(true) // this will start reading sentences
    // } else {
    //   setIsPlaying(false)
    // }
  }

  const pauseReading = () => {
    // Tts.stop()
    setIsPlaying(false)
  }

  const handleBackward = async () => {
    // setSentenceIndex(prev => Math.max(0, prev - 1)) // it return the bigger number so no negative values
    startReading()
  }

  const handleForward = async () => {
    // setSentenceIndex(prev => Math.min(sentences.length - 1, prev + 1))
    startReading()
  }

  //   const debounceDelay = 500

  //   const debouncedVolumeChange = debounce((newVolume: number) => {
  //     setVolume(newVolume)
  //     if (isPlaying) {
  //       Tts.stop().then(() =>
  //         setTimeout(() => {
  //           startReading()
  //           // eslint-disable-next-line no-magic-numbers
  //         }, 200),
  //       )
  //     }
  //   }, debounceDelay)

  const handleVolumeChange = (newVolume: number) => {
    // debouncedVolumeChange(newVolume)
    setVolume(newVolume)
  }

  const handleClose = async () => {
    setVisible(false)
    setExpandPlayer(false)
    await stopTts()
  }

  const ttsContextValue = useMemo(
    () => ({
      visible,
      setVisible,
      title,
      setTitle,
      volume,
      setVolume,
    }),
    [visible, title, volume],
  )
  return (
    <ttsContext.Provider value={ttsContextValue}>
      {children}
      {visible && (
        <StyledTtsPlayer $isPlaying={expandPlayer}>
          <StyledPanel>
            {expandPlayer && (
              <StyledBackForthButton label='backward Button' onClick={handleBackward}>
                <StyledText>{t('prev')}</StyledText>
                <BackForthIcon $flip src={PlaybackIcon} />
              </StyledBackForthButton>
            )}
            <StyledPlayIcon
              label='Play Button'
              onClick={() => {
                if (isPlaying) {
                  pauseReading()
                } else {
                  startReading()
                }
                setExpandPlayer(!isPlaying)
              }}>
              <PlayButtonIcon src={isPlaying ? PauseIcon : PlayIcon} />
            </StyledPlayIcon>
            {expandPlayer && (
              <StyledBackForthButton label='Forward Button' onClick={handleForward}>
                <BackForthIcon $flip={false} src={PlaybackIcon} />
                <StyledText>{t('next')}</StyledText>
              </StyledBackForthButton>
            )}
          </StyledPanel>
          {expandPlayer && (
            <StyledPanel>
              <Icon src={NoSoundIcon} style={{ height: 18, width: 18 }} />
              {/* <Slider maxValue={100} minValue={0} initialValue={volume} onValueChange={handleVolumeChange} /> */}
              <Icon src={SoundIcon} />
            </StyledPanel>
          )}
          <CloseView>
            {!expandPlayer && <StyledPlayerHeaderText>{t('readAloud')}</StyledPlayerHeaderText>}
            <CloseButton
              label='Close player'
              onClick={handleClose}
              style={{
                elevation: 5, // For Android shadow
                shadowColor: 'black', // For iOS shadow
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 3,
              }}>
              <Icon src={CloseIcon} />
              <StyledText>{t('common:close')}</StyledText>
            </CloseButton>
          </CloseView>
        </StyledTtsPlayer>
      )}
    </ttsContext.Provider>
  )
}

export default TtsPlayer
