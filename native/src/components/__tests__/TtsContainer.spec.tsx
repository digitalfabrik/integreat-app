import { act, fireEvent, RenderAPI, screen } from '@testing-library/react-native'
import { DateTime } from 'luxon'
import React, { useEffect } from 'react'
import Tts from 'react-native-tts'

import { PageModel } from 'shared/api'

import useTtsPlayer from '../../hooks/useTtsPlayer'
import renderWithTheme from '../../testing/render'
import TtsContainer from '../TtsContainer'

jest.mock('react-i18next')
jest.mock('react-native-tts')

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock')
  Reanimated.useEvent = jest.fn()
  return Reanimated
})
const dummyPage = new PageModel({
  path: '/test-path',
  title: 'test',
  content: '<p>This is a test</p>',
  lastUpdate: DateTime.now(),
})
describe('TtsContainer', () => {
  const TestChild = () => {
    const { setVisible } = useTtsPlayer('en', dummyPage)
    useEffect(() => {
      setVisible(true)
    }, [setVisible])
    return null
  }

  const renderTtsPlayer = (): RenderAPI =>
    renderWithTheme(
      <TtsContainer>
        <TestChild />
      </TtsContainer>,
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
    renderTtsPlayer()

    // Advance any pending timers or effects
    act(() => {
      jest.runAllTimers()
    })

    const playButton = screen.getByRole('button', { name: 'play' })
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
