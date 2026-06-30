import { waitFor } from '@testing-library/react-native'
import { DateTime } from 'luxon'
import React from 'react'

import { ChatMessageModel, loadFromEndpoint } from 'shared/api'

import TestingAppContext from '../../testing/TestingAppContext'
import render from '../../testing/render'
import Chat from '../Chat'

jest.mock('react-i18next')
jest.mock('@react-native-community/netinfo', () => ({ useNetInfo: jest.fn(() => ({ isConnected: true })) }))
jest.mock('../../utils/sentry', () => ({ captureError: jest.fn() }))
jest.mock('../../utils/helpers', () => ({ determineApiUrl: jest.fn(async () => 'https://api') }))

let focusCallback: (() => void | (() => unknown)) | null = null
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useFocusEffect: (callback: () => void | (() => unknown)) => {
    focusCallback = callback
  },
}))

jest.mock('shared/api', () => ({
  ...jest.requireActual('shared/api'),
  loadFromEndpoint: jest.fn(),
}))

jest.mock('../../components/WebView', () => {
  const { Text } = require('react-native')
  return ({ source }: { source: { uri: string } }) => <Text testID='webview'>{source.uri}</Text>
})

describe('Chat', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    focusCallback = null
  })

  const { mocked } = jest

  it('shows a spinner and seeds default chat settings if none exist for the region', async () => {
    const updateChatSettings = jest.fn()
    const { getByLabelText, queryByTestId } = render(
      <TestingAppContext settings={{ chat: {} }} updateChatSettings={updateChatSettings}>
        <Chat />
      </TestingAppContext>,
    )

    expect(queryByTestId('webview')).toBeNull()
    expect(getByLabelText('loading')).toBeTruthy()
    await waitFor(() => expect(updateChatSettings).toHaveBeenCalledWith({ seenMessages: 0, id: expect.any(String) }))
  })

  it('renders the chat webview with a URL containing the existing chat id', () => {
    const { getByTestId } = render(
      <TestingAppContext settings={{ chat: { augsburg: { id: 'existing-chat-id', seenMessages: 2 } } }}>
        <Chat />
      </TestingAppContext>,
    )

    const uri = getByTestId('webview').props.children
    expect(uri).toContain('chat=true')
    expect(uri).toContain('chatId=existing-chat-id')
  })

  it('updates seenMessages on blur using the incoming message count', async () => {
    const buildMessage = (id: number, userIsAuthor: boolean) =>
      new ChatMessageModel({ id, content: '', created: DateTime.now(), userIsAuthor, automaticAnswer: false })
    mocked(loadFromEndpoint).mockResolvedValue({
      messages: [buildMessage(1, false), buildMessage(2, true), buildMessage(3, false)],
    })
    const updateChatSettings = jest.fn()

    render(
      <TestingAppContext
        settings={{ chat: { augsburg: { id: 'existing-chat-id', seenMessages: 0 } } }}
        updateChatSettings={updateChatSettings}>
        <Chat />
      </TestingAppContext>,
    )

    expect(focusCallback).not.toBeNull()
    const focusReturn = focusCallback!()
    if (typeof focusReturn === 'function') {
      await focusReturn()
    }

    expect(updateChatSettings).toHaveBeenCalledWith({ seenMessages: 2 })
  })
})
