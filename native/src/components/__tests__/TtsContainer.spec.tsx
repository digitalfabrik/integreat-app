import Speech from '@mhpdev/react-native-speech'
import { fireEvent, RenderAPI, waitFor } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import React, { useContext } from 'react'
import { Platform } from 'react-native'
import mockSafeAreaContext from 'react-native-safe-area-context/jest/mock'
import { Button } from 'react-native-paper'

import buildConfig from '../../constants/buildConfig'
import useSnackbar from '../../hooks/useSnackbar'
import TestingAppContext from '../../testing/TestingAppContext'
import renderWithTheme from '../../testing/render'
import TtsContainer, { TtsContext } from '../TtsContainer'
import Text from '../base/Text'

jest.mock('react-i18next')
jest.mock('@mhpdev/react-native-speech', () => ({
  getAvailableVoices: jest.fn(() =>
    Promise.resolve([
      { language: 'en-US', name: 'English' },
      { language: 'de-DE', name: 'German' },
    ]),
  ),
  configure: jest.fn(),
  speak: jest.fn(() => Promise.resolve()),
  stop: jest.fn(() => Promise.resolve()),
  pause: jest.fn(() => Promise.resolve(true)),
  resume: jest.fn(() => Promise.resolve(true)),
  onFinish: jest.fn(() => ({ remove: jest.fn() })),
  onError: jest.fn(() => ({ remove: jest.fn() })),
}))
jest.mock('../../hooks/useSnackbar')

const mockBuildConfig = (tts: boolean) => {
  const previous = buildConfig()
  mocked(buildConfig).mockImplementation(() => ({
    ...previous,
    featureFlags: { ...previous.featureFlags, tts },
  }))
}

jest.useFakeTimers()

describe('TtsContainer', () => {
  Platform.OS = 'android'
  const showSnackbar = jest.fn()
  mocked(useSnackbar).mockImplementation(() => showSnackbar)
  const sentences = ['This is my first sentence', 'Second sentence', 'Third time is the charm']

  const TestChild = () => {
    const { setSentences, showTtsPlayer, visible } = useContext(TtsContext)
    return (
      <>
        <Button onPress={() => setSentences(sentences)} mode='contained'>
          set sentences
        </Button>
        <Button onPress={showTtsPlayer} mode='contained'>
          show
        </Button>
        {visible && <Text>visible</Text>}
      </>
    )
  }

  const renderTtsPlayer = (languageCode = 'en'): RenderAPI =>
    renderWithTheme(
      <TestingAppContext languageCode={languageCode}>
        <TtsContainer>
          <TestChild />
        </TtsContainer>
      </TestingAppContext>,
    )

  beforeEach(() => {
    jest.clearAllMocks()
    jest.clearAllTimers()
  })

  it('should do nothing if disabled', () => {
    mockBuildConfig(false)
    const { getByText, queryByRole } = renderTtsPlayer()
    fireEvent.press(getByText('show'))
    expect(showSnackbar).not.toHaveBeenCalled()
    expect(Speech.configure).not.toHaveBeenCalled()
    expect(queryByRole('button', { name: 'play' })).toBeFalsy()
  })

  it('should show snackbar if no sentences set', () => {
    mockBuildConfig(true)
    const { getByText, queryByRole } = renderTtsPlayer()
    fireEvent.press(getByText('show'))
    expect(showSnackbar).toHaveBeenCalledTimes(1)
    expect(showSnackbar).toHaveBeenCalledWith({ text: 'nothingToReadFullMessage' })
    expect(Speech.configure).not.toHaveBeenCalled()
    expect(queryByRole('button', { name: 'play' })).toBeFalsy()
  })

  it('should show tts player if enabled and sentences set', async () => {
    mockBuildConfig(true)
    const { getByText, getByRole } = renderTtsPlayer()
    await waitFor(() => expect(Speech.getAvailableVoices).toHaveBeenCalled())

    fireEvent.press(getByText('set sentences'))
    fireEvent.press(getByText('show'))
    expect(showSnackbar).not.toHaveBeenCalled()
    expect(Speech.configure).toHaveBeenCalledTimes(1)
    await waitFor(() => expect(getByRole('button', { name: 'play' })).toBeTruthy())
  })

  it('should set correct language for Deutsch (leicht)', async () => {
    mockBuildConfig(true)
    const { getByText, getByRole } = renderTtsPlayer('de-si')
    // Wait for mocked voices to be loaded so the language-supported check passes
    await waitFor(() => expect(Speech.getAvailableVoices).toHaveBeenCalled())
    fireEvent.press(getByText('set sentences'))
    fireEvent.press(getByText('show'))

    await waitFor(() => expect(getByRole('button', { name: 'play' })).toBeTruthy())
    fireEvent.press(getByRole('button', { name: 'play' }))
    await waitFor(() => expect(getByRole('button', { name: 'pause' })).toBeTruthy())

    expect(Speech.speak).toHaveBeenCalledTimes(1)
    expect(Speech.speak).toHaveBeenCalledWith(sentences[0], expect.objectContaining({ language: 'de' }))
  })

  it('should start playing and pause when the button is pressed', async () => {
    mockBuildConfig(true)
    const { getByText, getByRole } = renderTtsPlayer()
    await waitFor(() => expect(Speech.getAvailableVoices).toHaveBeenCalled())

    fireEvent.press(getByText('set sentences'))
    fireEvent.press(getByText('show'))

    await waitFor(() => expect(getByRole('button', { name: 'play' })).toBeTruthy())

    fireEvent.press(getByRole('button', { name: 'play' }))
    await waitFor(() => expect(getByRole('button', { name: 'pause' })).toBeTruthy())
    expect(Speech.speak).toHaveBeenCalledTimes(1)
    expect(Speech.speak).toHaveBeenCalledWith(sentences[0], expect.objectContaining({ language: 'en' }))
    expect(Speech.stop).toHaveBeenCalled()

    fireEvent.press(getByRole('button', { name: 'pause' }))
    await waitFor(() => expect(getByRole('button', { name: 'play' })).toBeTruthy())
    expect(Speech.pause).toHaveBeenCalled()
  })

  it('should close the player', async () => {
    mockBuildConfig(true)
    const { getByText, queryByText, getByRole, queryByRole, getByLabelText } = renderTtsPlayer()
    await waitFor(() => expect(Speech.getAvailableVoices).toHaveBeenCalled())

    fireEvent.press(getByText('set sentences'))
    fireEvent.press(getByText('show'))

    await waitFor(() => expect(getByRole('button', { name: 'play' })).toBeTruthy())

    fireEvent.press(getByRole('button', { name: 'play' }))
    await waitFor(() => expect(getByRole('button', { name: 'pause' })).toBeTruthy())

    expect(getByText('visible')).toBeTruthy()
    fireEvent.press(getByLabelText('common:close'))
    expect(queryByRole('button', { name: 'play' })).toBeFalsy()
    expect(Speech.stop).toHaveBeenCalled()
    expect(queryByText('visible')).toBeFalsy()
  })

  it('should play previous and next sentences', async () => {
    mockBuildConfig(true)
    const { getByText, getByRole } = renderTtsPlayer()
    await waitFor(() => expect(Speech.getAvailableVoices).toHaveBeenCalled())

    fireEvent.press(getByText('set sentences'))
    fireEvent.press(getByText('show'))

    await waitFor(() => expect(getByRole('button', { name: 'play' })).toBeTruthy())

    fireEvent.press(getByRole('button', { name: 'play' }))
    await waitFor(() => expect(getByRole('button', { name: 'pause' })).toBeTruthy())

    fireEvent.press(getByRole('button', { name: 'previous' }))
    await waitFor(() => expect(Speech.speak).toHaveBeenCalledTimes(2))
    expect(Speech.speak).toHaveBeenLastCalledWith(sentences[0], expect.objectContaining({ language: 'en' }))

    fireEvent.press(getByRole('button', { name: 'next' }))
    await waitFor(() => expect(Speech.speak).toHaveBeenCalledTimes(3))
    expect(Speech.speak).toHaveBeenLastCalledWith(sentences[1], expect.objectContaining({ language: 'en' }))

    fireEvent.press(getByRole('button', { name: 'next' }))
    await waitFor(() => expect(Speech.speak).toHaveBeenCalledTimes(4))
    expect(Speech.speak).toHaveBeenCalledWith(sentences[2], expect.objectContaining({ language: 'en' }))

    fireEvent.press(getByRole('button', { name: 'previous' }))
    await waitFor(() => expect(Speech.speak).toHaveBeenCalledTimes(5))
    expect(Speech.speak).toHaveBeenCalledWith(sentences[1], expect.objectContaining({ language: 'en' }))

    fireEvent.press(getByRole('button', { name: 'pause' }))
    await waitFor(() => expect(getByRole('button', { name: 'play' })).toBeTruthy())
    expect(Speech.pause).toHaveBeenCalled()

    fireEvent.press(getByRole('button', { name: 'play' }))
    await waitFor(() => expect(getByRole('button', { name: 'pause' })).toBeTruthy())
    expect(Speech.speak).toHaveBeenCalledTimes(5)
    expect(Speech.resume).toHaveBeenCalled()
  })

  it('should call Tts.setIgnoreSilentSwitch when on iOS', async () => {
    Platform.OS = 'ios'
    mockBuildConfig(true)
    const { getByText, getByRole } = renderTtsPlayer()
    await waitFor(() => expect(Speech.getAvailableVoices).toHaveBeenCalled())

    fireEvent.press(getByText('set sentences'))
    fireEvent.press(getByText('show'))

    expect(getByRole('button', { name: 'play' })).toBeTruthy()
    expect(Speech.configure).toHaveBeenCalledWith(
      expect.objectContaining({
        silentMode: 'ignore',
      }),
    )
  })
})
