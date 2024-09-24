import { NavigationContainer } from '@react-navigation/native'
import { fireEvent, RenderAPI } from '@testing-library/react-native'
import React from 'react'
import Tts from 'react-native-tts'

import renderWithTheme from '../../testing/render'
import TtsPlayer from '../TtsPlayer'

jest.mock('styled-components')
jest.mock('react-i18next')

describe('TtsPlayer', () => {
  const text = 'This is a test'

  const renderTtsPlayer = ({
    content = text,
    isTtsHtml = false,
    disabled = false,
  }: {
    disabled?: boolean
    isTtsHtml?: boolean
    content?: string
  }): RenderAPI =>
    renderWithTheme(
      <NavigationContainer>
        <TtsPlayer content={content} isTtsHtml={isTtsHtml} disabled={disabled} />
      </NavigationContainer>,
    )

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render and start reading non-HTML content when the button is pressed', () => {
    const { getByRole } = renderTtsPlayer({ isTtsHtml: false })

    const soundButton = getByRole('button')
    fireEvent.press(soundButton)

    expect(Tts.speak).toHaveBeenCalledWith(text)
    expect(Tts.setDefaultLanguage).toHaveBeenCalledTimes(1)
  })

  it('should render and start reading HTML content when the button is pressed', () => {
    const htmlContent = '<p>This is a test.</p>'
    const { getByText } = renderTtsPlayer({ isTtsHtml: true, content: htmlContent })

    const readButton = getByText('Read Text')
    fireEvent.press(readButton)

    expect(Tts.speak).toHaveBeenCalledWith('This is a test')
  })

  it('should pause reading when the pause button is pressed', () => {
    const { getByRole } = renderTtsPlayer({ isTtsHtml: false })

    const soundButton = getByRole('button')
    fireEvent.press(soundButton)

    expect(Tts.speak).toHaveBeenCalledWith(text)

    fireEvent.press(soundButton)

    expect(Tts.stop).toHaveBeenCalledTimes(1)
  })

  it('should initialize TTS engine on load', async () => {
    renderTtsPlayer({ isTtsHtml: false })

    expect(Tts.getInitStatus).toHaveBeenCalledTimes(1)
  })

  it('should remove TTS listeners on unmount', () => {
    const { unmount } = renderTtsPlayer({ isTtsHtml: false })

    unmount()

    expect(Tts.removeAllListeners).toHaveBeenCalledTimes(3) // 'tts-finish', 'tts-progress', 'tts-cancel'
  })
})
