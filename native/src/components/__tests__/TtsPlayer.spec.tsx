import { act, fireEvent, RenderAPI } from '@testing-library/react-native'
import React, { useEffect } from 'react'
import Tts from 'react-native-tts'

import useTtsPlayer from '../../hooks/useTtsPlayer'
import renderWithTheme from '../../testing/render'
import TtsPlayer from '../TtsPlayer'

jest.mock('react-i18next')
jest.mock('react-native-tts')

describe('TtsPlayer', () => {
  const TestChild = () => {
    const { setContent, setTitle, setVisible } = useTtsPlayer()

    useEffect(() => {
      setContent('<p>This is a test</p>')
      setTitle('test')
      setVisible(true)
    }, [setContent, setTitle, setVisible])

    return null
  }

  const renderTtsPlayer = (): RenderAPI =>
    renderWithTheme(
      <TtsPlayer initialVisibility>
        <TestChild />
      </TtsPlayer>,
    )

  beforeEach(() => {
    jest.clearAllMocks()
    jest.clearAllTimers()
  })

  it('should initialize TTS engine on load', async () => {
    renderTtsPlayer()
    expect(Tts.getInitStatus).toHaveBeenCalled()
  })

  it('should start reading when the button is pressed', async () => {
    const { getByRole } = renderTtsPlayer()

    // Advance any pending timers or effects
    act(() => {
      jest.runAllTimers()
    })

    const playButton = getByRole('button')
    fireEvent.press(playButton)

    expect(Tts.speak).toHaveBeenCalledWith(
      'test',
      expect.objectContaining({
        androidParams: expect.any(Object),
        iosVoiceId: '',
        rate: 1,
      }),
    )
  })

  it('should remove TTS listeners on unmount', () => {
    const { unmount } = renderTtsPlayer()

    unmount()

    expect(Tts.removeAllListeners).toHaveBeenCalledWith('tts-finish')
    expect(Tts.removeAllListeners).toHaveBeenCalledWith('tts-progress')
    expect(Tts.removeAllListeners).toHaveBeenCalledWith('tts-cancel')
  })
})
