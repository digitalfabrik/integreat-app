import { fireEvent, waitFor } from '@testing-library/react'
import React from 'react'

import {
  ChatMessageModel,
  createSendChatMessageEndpoint,
  ChatMessagesReturn,
  RegionModelBuilder,
  SerializedChatMessage,
} from 'shared/api'

import { CHAT_PRIVACY_POLICIES_STORAGE_KEY } from '../../hooks/useLocalStorage'
import { UseQueryFromEndpointReturn } from '../../hooks/useQueryFromEndpoint'
import { renderWithTheme } from '../../testing/render'
import Chat from '../Chat'

jest.mock(
  '../RemoteContent',
  () =>
    ({ html }: { html: string }) =>
      html,
)
jest.mock('react-i18next')
jest.mock('shared/api', () => ({
  ...jest.requireActual('shared/api'),
  createSendChatMessageEndpoint: jest.fn(),
}))
window.HTMLElement.prototype.scrollIntoView = jest.fn()

const region = new RegionModelBuilder(1).build()[0]!

const mockResponse = (
  override: Partial<UseQueryFromEndpointReturn<ChatMessagesReturn>> = {},
): UseQueryFromEndpointReturn<ChatMessagesReturn> =>
  ({
    data: { messages: [], botTyping: false },
    error: null,
    isPending: false,
    setData: jest.fn(),
    ...override,
  }) as never

const mockSetUnsyncedMessages = jest.fn()

const render = (response = mockResponse(), serializedUnsyncedMessages: SerializedChatMessage[] = []) =>
  renderWithTheme(
    <Chat
      region={region}
      chatId='test-chat-id'
      response={response}
      languageCode='de'
      serializedUnsyncedMessages={serializedUnsyncedMessages}
      setUnsyncedMessages={mockSetUnsyncedMessages}
      openUrl={jest.fn()}
    />,
  )

describe('Chat', () => {
  const sendMessage = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.setItem(CHAT_PRIVACY_POLICIES_STORAGE_KEY, JSON.stringify({ [region.code]: true }))
    sendMessage.mockResolvedValue({ data: { messages: [], botTyping: false }, error: null })
    jest.mocked(createSendChatMessageEndpoint).mockReturnValue({ request: sendMessage } as never)
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('should disable send button when no input is provided', () => {
    const { getByRole } = render()
    expect(getByRole('button', { name: 'chat,error:sendButton' })).toBeDisabled()
  })

  it('should enable send button and submit message when text is provided', () => {
    const { getByRole, getByPlaceholderText } = render()
    const buttonSendMessage = getByRole('button', { name: 'chat,error:sendButton' })

    const input = getByPlaceholderText('chat,error:chatInputHelperText', { exact: false })
    fireEvent.change(input, { target: { value: 'Meine Nachricht' } })

    expect(buttonSendMessage).toBeEnabled()
    fireEvent.click(buttonSendMessage)

    expect(createSendChatMessageEndpoint).toHaveBeenCalledTimes(1)
  })

  it('should display helper alert when not dismissed', () => {
    const { getByText } = render()
    expect(getByText('chat,error:conversationHelperText')).toBeTruthy()
  })

  it('should hide helper alert after closing it', () => {
    const { getByText, getByLabelText, queryByText } = render()
    expect(getByText('chat,error:conversationHelperText')).toBeTruthy()

    fireEvent.click(getByLabelText('Close'))

    expect(queryByText('chat,error:conversationHelperText')).toBeNull()
  })

  it('should show error alert when response has an error', () => {
    const { getByText } = render(mockResponse({ error: new Error('api error') }))
    expect(getByText('chat,error:unknownError')).toBeTruthy()
  })

  it('should disable send button when loading', () => {
    const { getByRole } = render(mockResponse({ isPending: true }))
    expect(getByRole('button', { name: 'chat,error:sendButton' })).toBeDisabled()
  })

  describe('unsynced messages', () => {
    it('should render retry button for unsynced messages passed as props', () => {
      const unsyncedMessage = ChatMessageModel.unsyncedMessage('Meine Nachricht')

      const { getByLabelText } = render(mockResponse(), [unsyncedMessage])

      expect(getByLabelText('chat:error:tryAgain')).toBeTruthy()
    })

    it('should call setUnsyncedMessages when send fails', async () => {
      sendMessage.mockRejectedValue(new Error('send failed'))

      const { getByRole, getByPlaceholderText } = render()

      const input = getByPlaceholderText('chat,error:chatInputHelperText', { exact: false })
      fireEvent.change(input, { target: { value: 'Meine Nachricht' } })
      fireEvent.click(getByRole('button', { name: 'chat,error:sendButton' }))

      await waitFor(() => expect(mockSetUnsyncedMessages).toHaveBeenCalledTimes(1))
    })

    it('should call setUnsyncedMessages to remove the message when retry succeeds', async () => {
      const unsyncedMessage = ChatMessageModel.unsyncedMessage('Meine Nachricht')

      const { getByLabelText } = render(mockResponse(), [unsyncedMessage])
      fireEvent.click(getByLabelText('chat:error:tryAgain'))

      await waitFor(() => expect(mockSetUnsyncedMessages).toHaveBeenCalledWith([]))
    })

    it('should not call setUnsyncedMessages when retry fails', async () => {
      const unsyncedMessage = ChatMessageModel.unsyncedMessage('Meine Nachricht')
      sendMessage.mockRejectedValue(new Error('send failed'))

      const { getByLabelText } = render(mockResponse(), [unsyncedMessage])
      fireEvent.click(getByLabelText('chat:error:tryAgain'))

      await waitFor(() => expect(sendMessage).toHaveBeenCalledTimes(1))
      expect(mockSetUnsyncedMessages).not.toHaveBeenCalled()
    })
  })

  describe('privacy policy', () => {
    beforeEach(() => {
      localStorage.clear()
    })

    it('should show privacy policy screen when not yet accepted', () => {
      const { getByText, queryByRole } = render()
      expect(getByText('chat,error:settings:privacyPolicy')).toBeTruthy()
      expect(queryByRole('button', { name: 'chat,error:sendButton' })).toBeNull()
    })

    it('should show chat after accepting privacy policy', () => {
      const { getByText, getByRole } = render()
      expect(getByText('chat,error:settings:privacyPolicy')).toBeTruthy()

      fireEvent.click(getByRole('checkbox'))

      expect(getByRole('button', { name: 'chat,error:sendButton' })).toBeTruthy()
    })
  })
})
