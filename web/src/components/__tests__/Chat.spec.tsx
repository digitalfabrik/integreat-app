import { fireEvent } from '@testing-library/react'
import React from 'react'

import { createSendChatMessageEndpoint, ChatMessagesReturn, RegionModelBuilder } from 'shared/api'

import { CHAT_PRIVACY_POLICIES_STORAGE_KEY } from '../../hooks/useLocalStorage'
import { UseQueryFromEndpointReturn } from '../../hooks/useQueryFromEndpoint'
import { renderWithTheme } from '../../testing/render'
import Chat from '../Chat'

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

const render = (response = mockResponse()) =>
  renderWithTheme(<Chat region={region} chatId='test-chat-id' response={response} languageCode='de' />)

describe('Chat', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.setItem(CHAT_PRIVACY_POLICIES_STORAGE_KEY, JSON.stringify({ [region.code]: true }))
    jest.mocked(createSendChatMessageEndpoint).mockReturnValue({
      request: jest.fn().mockResolvedValue({ data: { messages: [], botTyping: false }, error: null }),
    } as never)
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('should disable send button when no input is provided', () => {
    const { getByRole } = render()
    expect(getByRole('button', { name: 'chat:sendButton' })).toBeDisabled()
  })

  it('should enable send button and submit message when text is provided', () => {
    const { getByRole, getByPlaceholderText } = render()
    const buttonSendMessage = getByRole('button', { name: 'chat:sendButton' })

    fireEvent.change(getByPlaceholderText('chat:chatInputHelperText', { exact: false }), {
      target: { value: 'Meine Nachricht' },
    })
    expect(buttonSendMessage).toBeEnabled()
    fireEvent.click(buttonSendMessage)
    expect(createSendChatMessageEndpoint).toHaveBeenCalledTimes(1)
  })

  it('should display helper alert when not dismissed', () => {
    const { getByText } = render()
    expect(getByText('chat:conversationHelperText')).toBeTruthy()
  })

  it('should hide helper alert after closing it', () => {
    const { getByText, getByLabelText, queryByText } = render()
    expect(getByText('chat:conversationHelperText')).toBeTruthy()

    fireEvent.click(getByLabelText('Close'))

    expect(queryByText('chat:conversationHelperText')).toBeNull()
  })

  it('should show error alert when response has an error', () => {
    const { getByText } = render(mockResponse({ error: new Error('api error') }))
    expect(getByText('chat:errorMessage')).toBeTruthy()
  })

  it('should disable send button when loading', () => {
    const { getByRole } = render(mockResponse({ isPending: true }))
    expect(getByRole('button', { name: 'chat:sendButton' })).toBeDisabled()
  })

  describe('privacy policy', () => {
    beforeEach(() => {
      localStorage.clear()
    })

    it('should show privacy policy screen when not yet accepted', () => {
      const { getByText, queryByRole } = render()
      expect(getByText('chat:settings:privacyPolicy')).toBeTruthy()
      expect(queryByRole('button', { name: 'chat:sendButton' })).toBeNull()
    })

    it('should show chat after accepting privacy policy', () => {
      const { getByText, getByRole } = render()
      expect(getByText('chat:settings:privacyPolicy')).toBeTruthy()

      fireEvent.click(getByRole('checkbox'))

      expect(getByRole('button', { name: 'chat:sendButton' })).toBeTruthy()
    })
  })
})
