import { act, fireEvent, RenderAPI, screen } from '@testing-library/react-native'
import * as Speech from 'expo-speech'
import { DateTime } from 'luxon'
import React, { useEffect } from 'react'

import { PageModel } from 'shared/api'

import useTtsPlayer from '../../hooks/useTtsPlayer'
import TestingAppContext from '../../testing/TestingAppContext'
import renderWithTheme from '../../testing/render'
import TtsContainer from '../TtsContainer'

jest.mock('react-i18next')
jest.mock('expo-speech')

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock')
  Reanimated.useEvent = jest.fn()
  return Reanimated
})
// const mockBuildConfig = (tts: boolean) => {
//   const previous = buildConfig()
//   mocked(buildConfig).mockImplementation(() => ({
//     ...previous,
//     featureFlags: { ...previous.featureFlags, tts },
//   }))
// }
const dummyPage = new PageModel({
  path: '/test-path',
  title: 'test',
  content: '<p>This is a test</p>',
  lastUpdate: DateTime.now(),
})
describe('TtsContainer', () => {
  const TestChild = () => {
    const { setVisible } = useTtsPlayer(dummyPage)
    useEffect(() => {
      setVisible(true)
    }, [setVisible])
    return null
  }

  const renderTtsPlayer = (): RenderAPI =>
    renderWithTheme(
      <TestingAppContext languageCode='en'>
        <TtsContainer>
          <TestChild />
        </TtsContainer>
      </TestingAppContext>,
    )

  beforeEach(() => {
    jest.clearAllMocks()
    jest.clearAllTimers()
  })

  it('should start reading when the button is pressed', () => {
    renderTtsPlayer()

    // Advance any pending timers or effects
    act(() => {
      jest.runAllTimers()
    })

    const playButton = screen.getByRole('button', { name: 'play' })
    fireEvent.press(playButton)

    expect(Speech.speak).toHaveBeenCalledWith('test', {
      language: 'en',
      onDone: expect.any(Function),
    })
  })
})
