import EasySpeech from 'easy-speech'
import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import segment from 'sentencex'
import styled, { useTheme } from 'styled-components'

import { CloseIcon, NoSoundIcon, PauseIcon, PlaybackIcon, PlayIcon, SoundIcon } from '../assets'
import dimensions from '../constants/dimensions'
import useTtsPlayer from '../hooks/useTtsPlayer'
import { reportError } from '../utils/sentry'
import TtsHelpModal from './TtsHelpModal'
import Button from './base/Button'
import Icon from './base/Icon'

const StyledTtsPlayer = styled.dialog<{ $isPlaying: boolean }>`
  background-color: #dedede;
  border-radius: 28px;
  width: 388px;
  display: flex;
  flex-direction: ${props => (props.$isPlaying ? 'column' : 'row')};
  justify-content: center;
  align-items: center;
  align-self: center;
  padding: 6px;
  position: sticky;
  bottom: 5px;
  min-height: 93px;
  gap: ${props => (props.$isPlaying ? '5px;' : '10px')};
  border-color: transparent;

  @media ${dimensions.smallViewport} {
    width: 90%;
  }
`

const StyledPanel = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
  padding: 0 10px;
`

const StyledSliderPanel = styled(StyledPanel)`
  width: 90%;
`

const StyledPlayIcon = styled(Button)`
  background-color: #232323;
  width: 50px;
  height: 50px;
  border-radius: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 1px 5px 10px 1px grey;
`

const StyledBackForthButton = styled(Button)`
  display: flex;
  flex-direction: ${props => (props.theme.contentDirection === 'rtl' ? 'row-reverse ' : 'row')};
  gap: 5px;
  align-items: flex-end;
`

const PlayButtonIcon = styled(Icon)`
  color: #dedede;
`

const StyleSoundIcon = styled(Icon)`
  height: 30px;
  width: 30px;
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
  box-shadow: 1px 5px 5px 1px grey;
`

const CloseView = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: center;
`

const Slider = styled.input`
  width: 100%;
  border-radius: 25px;
  appearance: none;
  background: #b9b9b9;

  &::-ms-track {
    border-radius: 25px;
  }

  &::-webkit-slider-thumb {
    appearance: none;
    height: 16px;
    width: 16px;
    border-radius: 50%;
    background: #333;
    cursor: pointer;
  }

  &::-moz-range-thumb {
    height: 16px;
    width: 16px;
    border-radius: 50%;
    background: #333;
    cursor: pointer;
  }
`

type TtsPlayerProps = {
  languageCode: string
}

const TtsPlayer = ({ languageCode }: TtsPlayerProps): ReactElement | null => {
  const { t } = useTranslation('layout')
  const theme = useTheme()
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [expandPlayer, setExpandPlayer] = useState(false)
  const { content, volume, setVolume, title, visible, setVisible } = useTtsPlayer()
  const [currentSentencesIndex, setCurrentSentenceIndex] = useState<number>(0)
  const [sentences, setSentences] = useState<string[]>([])
  const [showHelpModal, setShowHelpModal] = useState(false)
  const numOfSentencesToSkip = 1
  const EasySpeechInfo = EasySpeech.detect()
  const allowIncrement = useRef(true)
  const maxTitle = 20
  const isTitleLong = title.length > maxTitle ? title.substring(0, maxTitle).concat('...') : title || t('readAloud')
  const userAgent = navigator.userAgent
  const isAndroid = Boolean(/android/i.test(userAgent))

  const handleBoundary = (event: SpeechSynthesisEvent) => {
    if (event.name === 'sentence' && allowIncrement.current) {
      setCurrentSentenceIndex((prevIndex: number) => prevIndex + 1)
    }
    allowIncrement.current = true
    if (currentSentencesIndex >= sentences.length - 1) {
      setCurrentSentenceIndex(0)
      setIsPlaying(false)
      setExpandPlayer(false)
    }
  }

  useEffect(() => {
    EasySpeech.init({ maxTimeout: 5000, interval: 250 }).catch(e => reportError(e))
    return () => {
      EasySpeech.cancel()
      EasySpeech.reset()
      setCurrentSentenceIndex(0)
    }
  }, [])

  useEffect(() => {
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = content

    const appendPeriod = (elements: NodeListOf<HTMLElement>) => {
      elements.forEach((element: HTMLElement) => {
        const trimmedText = element.textContent?.trim()
        if (trimmedText && !trimmedText.endsWith('.')) {
          // eslint-disable-next-line no-param-reassign
          element.textContent = trimmedText.concat('.')
        }
      })
    }

    const listItems = tempDiv.querySelectorAll('li')
    appendPeriod(listItems)

    const paragraphs = tempDiv.querySelectorAll('p')
    appendPeriod(paragraphs)

    const textContent = tempDiv.textContent || tempDiv.innerText
    setSentences(segment(languageCode, textContent))
    setCurrentSentenceIndex(0)
  }, [content, languageCode])

  const startReading = async (index = currentSentencesIndex) => {
    EasySpeech.cancel()
    const voices = EasySpeech.voices()
    const selectedVoice = voices.find((voice: SpeechSynthesisVoice) => voice.lang.startsWith(languageCode))
    if (selectedVoice == null) {
      setSentences([])
      setShowHelpModal(true)
      return
    }
    await EasySpeech.speak({
      text: sentences.slice(index).join(' '),
      voice: selectedVoice,
      pitch: 1,
      rate: 1,
      volume,
      boundary: e => handleBoundary(e),
    }).catch(() => null)
  }

  const pauseReading = () => {
    EasySpeech.pause()
    setIsPlaying(false)
  }
  const withSkip = async (action: () => Promise<void>) => {
    allowIncrement.current = true
    try {
      await action()
    } finally {
      allowIncrement.current = false
    }
  }
  const togglePlayPause = () => {
    if (isPlaying) {
      pauseReading()
    } else if (currentSentencesIndex !== 0 && !isAndroid) {
      setIsPlaying(true)
      EasySpeech.resume()
    } else {
      setIsPlaying(true)
      withSkip(() => startReading())
    }
    setExpandPlayer(!isPlaying)
  }

  const handleForward = () => {
    if (isPlaying) {
      EasySpeech.cancel()
    }
    setCurrentSentenceIndex(prevIndex => {
      const newIndex = Math.min(prevIndex + numOfSentencesToSkip, sentences.length - 1)
      withSkip(() => startReading(newIndex))
      return newIndex
    })
  }

  const handleBackward = () => {
    if (isPlaying) {
      EasySpeech.cancel()
    }
    setCurrentSentenceIndex(prevIndex => {
      const newIndex = Math.max(0, prevIndex - numOfSentencesToSkip)
      withSkip(() => startReading(newIndex))
      return newIndex
    })
  }

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value)
    setVolume(newVolume)
    EasySpeech.cancel()
    withSkip(() => startReading())
  }

  const handleClose = () => {
    setVisible(false)
    setExpandPlayer(false)
    EasySpeech.cancel()
    setCurrentSentenceIndex(0)
    setIsPlaying(false)
  }
  if (visible) {
    return (
      <>
        {showHelpModal && <TtsHelpModal closeModal={() => setShowHelpModal(false)} />}
        <StyledTtsPlayer $isPlaying={expandPlayer}>
          <StyledPanel style={{ flexDirection: theme.contentDirection === 'rtl' ? 'row-reverse' : 'row' }}>
            {expandPlayer && (
              <StyledBackForthButton label='backward-button' onClick={handleBackward}>
                <StyledText>{t('prev')}</StyledText>
                <BackForthIcon $flip src={PlaybackIcon} />
              </StyledBackForthButton>
            )}
            <StyledPlayIcon label='play-button' onClick={togglePlayPause}>
              <PlayButtonIcon src={isPlaying ? PauseIcon : PlayIcon} />
            </StyledPlayIcon>
            {expandPlayer && (
              <StyledBackForthButton label='forward-button' onClick={handleForward}>
                <BackForthIcon $flip={false} src={PlaybackIcon} />
                <StyledText>{t('next')}</StyledText>
              </StyledBackForthButton>
            )}
          </StyledPanel>
          {expandPlayer && (
            <StyledSliderPanel>
              <Icon src={NoSoundIcon} />
              <Slider
                aria-label='slider-component'
                type='range'
                min='0'
                max='1'
                step='0.1'
                value={volume}
                onChange={handleVolumeChange}
              />
              <StyleSoundIcon src={SoundIcon} />
            </StyledSliderPanel>
          )}
          <CloseView>
            {!expandPlayer && <StyledPlayerHeaderText>{isTitleLong}</StyledPlayerHeaderText>}
            <CloseButton label='close-player' onClick={handleClose}>
              <Icon src={CloseIcon} />
              <StyledText>{t('common:close')}</StyledText>
            </CloseButton>
          </CloseView>
        </StyledTtsPlayer>
      </>
    )
  }
  return null
}

export default TtsPlayer
