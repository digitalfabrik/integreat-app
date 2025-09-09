import { fireEvent, RenderAPI, waitFor } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import React, { useContext } from 'react'
import { Platform } from 'react-native'
import mockSafeAreaContext from 'react-native-safe-area-context/jest/mock'
import Tts from 'react-native-tts'

import buildConfig from '../../constants/buildConfig'
import useSnackbar from '../../hooks/useSnackbar'
import TestingAppContext from '../../testing/TestingAppContext'
import renderWithTheme from '../../testing/render'
import TtsContainer, { TtsContext } from '../TtsContainer'
import Text from '../base/Text'
import TextButton from '../base/TextButton'

jest.mock('react-native-safe-area-context', () => mockSafeAreaContext)
jest.mock('react-i18next')
jest.mock('react-native-tts', () => ({
  addEventListener: jest.fn(),
  getInitStatus: jest.fn(() => Promise.resolve()),
  removeAllListeners: jest.fn(),
  setDefaultLanguage: jest.fn(),
  setIgnoreSilentSwitch: jest.fn(),
  speak: jest.fn(),
  stop: jest.fn(() => Promise.resolve()),
}))
jest.mock('../../hooks/useSnackbar')
jest.mock('shared/api', () => ({
  ...jest.requireActual('shared/api'),
  useLoadAsync: jest.fn(() => ({
    data: [
      { language: 'en-US', name: 'English' },
      { language: 'de-DE', name: 'German' },
    ],
    refresh: jest.fn(),
  })),
}))

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
        <TextButton onPress={() => setSentences(sentences)} text='set sentences' />
        <TextButton onPress={showTtsPlayer} text='show' />
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
    expect(Tts.getInitStatus).not.toHaveBeenCalled()
    expect(queryByRole('button', { name: 'play' })).toBeFalsy()
  })

  it('should show snackbar if no sentences set', () => {
    mockBuildConfig(true)
    const { getByText, queryByRole } = renderTtsPlayer()
    fireEvent.press(getByText('show'))
    expect(showSnackbar).toHaveBeenCalledTimes(1)
    expect(showSnackbar).toHaveBeenCalledWith({ text: 'nothingToReadFullMessage' })
    expect(Tts.getInitStatus).not.toHaveBeenCalled()
    expect(queryByRole('button', { name: 'play' })).toBeFalsy()
  })

  it('should show tts player if enabled and sentences set', async () => {
    mockBuildConfig(true)
    const { getByText, getByRole } = renderTtsPlayer()
    fireEvent.press(getByText('set sentences'))
    fireEvent.press(getByText('show'))
    expect(showSnackbar).not.toHaveBeenCalled()
    expect(Tts.getInitStatus).toHaveBeenCalledTimes(1)
    await waitFor(() => expect(getByRole('button', { name: 'play' })).toBeTruthy())
  })

  it('should set correct language for Deutsch (leicht)', async () => {
    mockBuildConfig(true)
    const { getByText, getByRole } = renderTtsPlayer('de-si')
    fireEvent.press(getByText('set sentences'))
    fireEvent.press(getByText('show'))

    await waitFor(() => expect(getByRole('button', { name: 'play' })).toBeTruthy())
    fireEvent.press(getByRole('button', { name: 'play' }))
    await waitFor(() => expect(getByRole('button', { name: 'pause' })).toBeTruthy())

    expect(Tts.setDefaultLanguage).toHaveBeenCalledTimes(1)
    expect(Tts.setDefaultLanguage).toHaveBeenCalledWith('de')
  })

  it('should start playing and pause when the button is pressed', async () => {
    mockBuildConfig(true)
    const { getByText, getByRole } = renderTtsPlayer()
    fireEvent.press(getByText('set sentences'))
    fireEvent.press(getByText('show'))

    expect(Tts.stop).toHaveBeenCalledTimes(1)
    await waitFor(() => expect(getByRole('button', { name: 'play' })).toBeTruthy())

    fireEvent.press(getByRole('button', { name: 'play' }))
    await waitFor(() => expect(getByRole('button', { name: 'pause' })).toBeTruthy())
    expect(Tts.speak).toHaveBeenCalledTimes(1)
    expect(Tts.speak).toHaveBeenCalledWith(sentences[0], expect.objectContaining({}))
    expect(Tts.stop).toHaveBeenCalledTimes(2)

    fireEvent.press(getByRole('button', { name: 'pause' }))
    await waitFor(() => expect(getByRole('button', { name: 'play' })).toBeTruthy())
    expect(Tts.stop).toHaveBeenCalledTimes(3)
  })

  it('should close the player', async () => {
    mockBuildConfig(true)
    const { getByText, queryByText, getByRole, queryByRole, getByLabelText } = renderTtsPlayer()
    fireEvent.press(getByText('set sentences'))
    fireEvent.press(getByText('show'))

    expect(Tts.stop).toHaveBeenCalledTimes(1)
    await waitFor(() => expect(getByRole('button', { name: 'play' })).toBeTruthy())

    fireEvent.press(getByRole('button', { name: 'play' }))
    await waitFor(() => expect(getByRole('button', { name: 'pause' })).toBeTruthy())
    expect(Tts.stop).toHaveBeenCalledTimes(2)

    expect(getByText('visible')).toBeTruthy()
    fireEvent.press(getByLabelText('common:close'))
    expect(queryByRole('button', { name: 'play' })).toBeFalsy()
    expect(Tts.stop).toHaveBeenCalledTimes(3)
    expect(queryByText('visible')).toBeFalsy()
  })

  it('should play previous and next sentences', async () => {
    mockBuildConfig(true)
    const { getByText, getByRole } = renderTtsPlayer()
    fireEvent.press(getByText('set sentences'))
    fireEvent.press(getByText('show'))

    await waitFor(() => expect(getByRole('button', { name: 'play' })).toBeTruthy())

    fireEvent.press(getByRole('button', { name: 'play' }))
    await waitFor(() => expect(getByRole('button', { name: 'pause' })).toBeTruthy())
    expect(Tts.stop).toHaveBeenCalledTimes(2)

    fireEvent.press(getByRole('button', { name: 'previous' }))
    await waitFor(() => expect(Tts.speak).toHaveBeenCalledTimes(2))
    expect(Tts.speak).toHaveBeenLastCalledWith(sentences[0], expect.objectContaining({}))
    expect(Tts.stop).toHaveBeenCalledTimes(3)

    fireEvent.press(getByRole('button', { name: 'next' }))
    await waitFor(() => expect(Tts.speak).toHaveBeenCalledTimes(3))
    expect(Tts.speak).toHaveBeenLastCalledWith(sentences[1], expect.objectContaining({}))
    expect(Tts.stop).toHaveBeenCalledTimes(4)

    fireEvent.press(getByRole('button', { name: 'next' }))
    await waitFor(() => expect(Tts.speak).toHaveBeenCalledTimes(4))
    expect(Tts.speak).toHaveBeenCalledWith(sentences[2], expect.objectContaining({}))
    expect(Tts.stop).toHaveBeenCalledTimes(5)

    fireEvent.press(getByRole('button', { name: 'previous' }))
    await waitFor(() => expect(Tts.speak).toHaveBeenCalledTimes(5))
    expect(Tts.speak).toHaveBeenCalledWith(sentences[1], expect.objectContaining({}))
    expect(Tts.stop).toHaveBeenCalledTimes(6)

    fireEvent.press(getByRole('button', { name: 'pause' }))
    await waitFor(() => expect(getByRole('button', { name: 'play' })).toBeTruthy())
    expect(Tts.stop).toHaveBeenCalledTimes(7)

    fireEvent.press(getByRole('button', { name: 'play' }))
    await waitFor(() => expect(getByRole('button', { name: 'pause' })).toBeTruthy())
    expect(Tts.speak).toHaveBeenCalledTimes(6)
    expect(Tts.speak).toHaveBeenLastCalledWith(sentences[1], expect.objectContaining({}))
    expect(Tts.stop).toHaveBeenCalledTimes(8)
  })

  it('should call Tts.setIgnoreSilentSwitch when on iOS', async () => {
    Platform.OS = 'ios'
    mockBuildConfig(true)
    const { getByText, getByRole } = renderTtsPlayer()
    fireEvent.press(getByText('set sentences'))
    fireEvent.press(getByText('show'))

    await waitFor(() => expect(getByRole('button', { name: 'play' })).toBeTruthy())
    expect(Tts.setIgnoreSilentSwitch).toHaveBeenCalledWith('ignore')
  })
})
