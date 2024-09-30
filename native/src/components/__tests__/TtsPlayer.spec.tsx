import { act, fireEvent, RenderAPI } from '@testing-library/react-native'
import React from 'react'
import Tts from 'react-native-tts'

import useTtsPlayer from '../../hooks/useTtsPlayer'
import renderWithTheme from '../../testing/render'
import TtsPlayer from '../TtsPlayer'

jest.mock('styled-components')
jest.mock('react-i18next')

describe('TtsPlayer', () => {
  const enqueueTts = jest.fn()

  const MockComponent = () => {
    const ttsContextValue = useTtsPlayer()
    enqueueTts.mockImplementation(() => ttsContextValue)
    return null
  }

  const renderTtsPlayer = ({ disabled = false }: { disabled?: boolean }): RenderAPI =>
    renderWithTheme(
      <TtsPlayer disabled={disabled} initialVisibility>
        <MockComponent />
      </TtsPlayer>,
    )

  beforeEach(() => {
    jest.clearAllMocks()
    jest.clearAllTimers()
  })

  it('should start reading when the button is pressed', async () => {
    const text = 'This is a test'
    const { getByRole } = renderTtsPlayer({ disabled: false })

    const soundButton = getByRole('button')
    fireEvent.press(soundButton)

    act(() => {
      enqueueTts.mockImplementation(() => ({
        content: text,
        setContent: jest.fn(),
        sentenceIndex: 0,
        setSentenceIndex: jest.fn(),
        visible: true,
        setVisible: jest.fn(),
      }))
    })

    await act(async () => {
      jest.advanceTimersByTime(1000) // Simulate some delay
    })

    expect(Tts.speak).toHaveBeenCalled()
  })

  it('should initialize TTS engine on load', async () => {
    renderTtsPlayer({ disabled: false })

    expect(Tts.getInitStatus).toHaveBeenCalledTimes(1)
  })

  it('should remove TTS listeners on unmount', () => {
    const { unmount } = renderTtsPlayer({ disabled: false })

    unmount()

    expect(Tts.removeAllListeners).toHaveBeenCalledTimes(3) // 'tts-finish', 'tts-progress', 'tts-cancel'
  })
})
