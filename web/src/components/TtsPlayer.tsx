import React, { ReactElement, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { CloseIcon, NoSoundIcon, PauseIcon, PlaybackIcon, PlayIcon, SoundIcon } from '../assets'
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
  position: fixed;
  bottom: 5px;
  min-height: 93px;
  gap: ${props => (props.$isPlaying ? '5px;' : '10px')};
  border-color: transparent;
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
  display: flex;
  justify-content: center;
  align-items: center;
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
const StyledNoSoundIcon = styled(Icon)`
  height: 18px;
  width: 18px;
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
  box-shadow: 1px 1px 10px 1px grey;
`

const CloseView = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: center;
`
const voidElements = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
])

type TtsPlayerProps = {
  html: string
  initialVisibility?: boolean
  languageCode: string
}
const TtsPlayer = ({ initialVisibility = false, html, languageCode }: TtsPlayerProps): ReactElement | null => {
  const { t } = useTranslation('layout')
  const [isPlaying, setIsPlaying] = useState<boolean | null>(null)
  const [expandPlayer, setExpandPlayer] = useState(false)
  const defaultVolume = 50
  const [volume, setVolume] = useState(defaultVolume)
  const [visible, setVisible] = useState(initialVisibility)
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null)
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null)
  const [currentWordIndex, setCurrentWordIndex] = useState<number | null>(null)

  const handleBoundary = (event: SpeechSynthesisEvent, newUtterance: SpeechSynthesisUtterance) => {
    if (event.name === 'word') {
      const textUpToChar = newUtterance.text.substring(0, event.charIndex)
      const words = textUpToChar.split(/\s+/)
      const index = words.length - 1
      setCurrentWordIndex(index)
    }
  }

  useEffect(() => {
    const synth = window.speechSynthesis
    const u = new SpeechSynthesisUtterance()

    const handleVoicesChanged = () => {
      const voices = synth.getVoices()

      // Select voice matching the passed languageCode
      const selectedVoice = voices.find(voice => voice.lang.startsWith(languageCode))

      if (selectedVoice) {
        setVoice(selectedVoice)
        u.voice = selectedVoice
      } else if (voices.length > 0) {
        // Fallback to the first available voice if no match is found
        setVoice(voices[0])
        u.voice = voices[0]
      }
    }

    synth.addEventListener('voiceschanged', handleVoicesChanged)
    handleVoicesChanged()

    setUtterance(u)

    return () => {
      synth.cancel()
      synth.removeEventListener('voiceschanged', handleVoicesChanged)
    }
  }, [languageCode])

  useEffect(() => {
    if (utterance) {
      // Extract text from HTML
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = html
      utterance.text = tempDiv.textContent || tempDiv.innerText || ''
      // utterance.pitch = pitch
      // utterance.rate = rate
      utterance.volume = volume
      if (voice) {
        utterance.voice = voice
      }
      const boundaryHandler = (event: SpeechSynthesisEvent) => handleBoundary(event, utterance)
      utterance.onboundary = boundaryHandler

      // Reset current word index when text changes
      setCurrentWordIndex(null)
    }
  }, [html, utterance, volume, voice])

  useEffect(() => {
    const synth = window.speechSynthesis
    if (isPlaying === null) {
      synth.cancel()
      return
    }
    if (isPlaying && synth.paused) {
      synth.resume()
    } else if (utterance) {
      synth.speak(utterance)
    }
    if (isPlaying === false) {
      synth.pause()
    }
  }, [isPlaying, utterance])

  const startReading = () => {
    setIsPlaying(true)
  }

  const pauseReading = () => {
    // Tts.stop()
    setIsPlaying(false)
  }

  const handleBackward = async () => {
    // setSentenceIndex(prev => Math.max(0, prev - 1)) // it return the bigger number so no negative values
    // startReading()
  }

  const handleForward = async () => {
    // setSentenceIndex(prev => Math.min(sentences.length - 1, prev + 1))
    // startReading()
  }

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value)
    setVolume(newVolume)

    if (utterance) {
      // Cancel current utterance and restart with the new volume
      const synth = window.speechSynthesis
      synth.cancel()

      const newUtterance = new SpeechSynthesisUtterance()
      newUtterance.text = utterance.text
      newUtterance.voice = voice
      newUtterance.volume = newVolume
      const boundaryHandler = (event: SpeechSynthesisEvent) => handleBoundary(event, newUtterance)
      newUtterance.onboundary = boundaryHandler

      // Speak the new utterance with the updated volume
      setUtterance(newUtterance)
      synth.speak(newUtterance)
    }
  }

  const handleClose = async () => {
    setVisible(false)
    setExpandPlayer(false)
  }

  const renderContent = useCallback(() => {
    let wordCount = 0
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')

    const traverse = (node: Node): React.ReactNode => {
      if (node.nodeType === Node.TEXT_NODE) {
        const words = node.textContent?.split(/(\s+)/) || []
        return words.map(word => {
          if (word.trim() === '') {
            return word
          }
          const currentIndex = wordCount
          wordCount += 1
          return (
            <span
              key={`word-${currentIndex}`}
              data-word-index={currentIndex}
              className={currentWordIndex === currentIndex ? 'highlight' : undefined}>
              {word}
            </span>
          )
        })
      }

      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement
        const tagName = element.tagName.toLowerCase()

        // Extract attributes
        const attrs: { [key: string]: unknown } = {}
        Array.from(element.attributes).forEach(attr => {
          if (attr.name === 'style') {
            // Parse style string into an object
            const styleObject: { [key: string]: string } = {}
            const styleString = attr.value
            styleString.split(';').forEach(styleRule => {
              if (styleRule.trim() === '') return
              const [property, value] = styleRule.split(':')
              if (property && value) {
                const camelCasedProperty = property.trim().replace(/-([a-z])/g, (_, char) => char.toUpperCase())
                styleObject[camelCasedProperty] = value.trim()
              }
            })
            attrs.style = styleObject
          } else if (attr.name === 'class') {
            attrs.className = attr.value
          } else if (attr.name === 'for') {
            attrs.htmlFor = attr.value
          } else {
            attrs[attr.name] = attr.value
          }
        })

        if (voidElements.has(tagName)) {
          // Render void elements without children
          return React.createElement(tagName, {
            key: `void-${tagName}-${wordCount}`,
            ...attrs,
          })
        }

        // Render non-void elements with children
        const children = Array.from(element.childNodes).map((child, index) => (
          <React.Fragment key={`element${index + 1}`}>{traverse(child)}</React.Fragment>
        ))
        return React.createElement(tagName, { key: `element-${tagName}-${wordCount}`, ...attrs }, children)
      }

      return null
    }

    return traverse(doc.body)
  }, [currentWordIndex, html])

  return (
    <div>
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
              <PlayButtonIcon src={isPlaying ?? false ? PauseIcon : PlayIcon} />
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
              <StyledNoSoundIcon src={NoSoundIcon} />
              {/* <Slider maxValue={100} minValue={0} initialValue={volume} onValueChange={handleVolumeChange} /> */}
              <input type='range' min='0' max='1' step='0.1' value={volume} onChange={handleVolumeChange} />
              <Icon src={SoundIcon} />
            </StyledPanel>
          )}
          <CloseView>
            {!expandPlayer && <StyledPlayerHeaderText>{t('readAloud')}</StyledPlayerHeaderText>}
            <CloseButton label='Close player' onClick={handleClose}>
              <Icon src={CloseIcon} />
              <StyledText>{t('common:close')}</StyledText>
            </CloseButton>
          </CloseView>
        </StyledTtsPlayer>
      )}
      <div>{renderContent()}</div>
      <style jsx>{`
        .highlight {
          background-color: yellow;
        }
      `}</style>
    </div>
  )
}

export default TtsPlayer
