import { fireEvent } from '@testing-library/react'
import React from 'react'

import { RegionModelBuilder, ChatMessageModel } from 'shared/api'

import { CHAT_PRIVACY_POLICY_ACCEPTED_STORAGE_KEY } from '../../hooks/useLocalStorage'
import { renderWithTheme } from '../../testing/render'
import Chat from '../Chat'

const submitMessage = jest.fn()
jest.mock('react-i18next')
window.HTMLElement.prototype.scrollIntoView = jest.fn()

const region = new RegionModelBuilder(1).build()[0]!

const render = (messages: ChatMessageModel[], hasError: boolean, isLoading: boolean) =>
  renderWithTheme(
    <Chat
      region={region}
      messages={messages}
      hasError={hasError}
      isLoading={isLoading}
      submitMessage={submitMessage}
      isTyping={false}
      languageCode='de'
    />,
  )

describe('Chat', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.setItem(CHAT_PRIVACY_POLICY_ACCEPTED_STORAGE_KEY, JSON.stringify({ [region.code]: true }))
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('sending button should be disabled if no input text is provided', () => {
    const { getByRole } = render([], false, false)
    expect(getByRole('button', { name: 'chat:sendButton' })).toBeDisabled()
  })

  it('should be able to send a message if text is provided', () => {
    const { getByRole, getByPlaceholderText } = render([], false, false)
    const buttonSendMessage = getByRole('button', { name: 'chat:sendButton' })

    fireEvent.change(getByPlaceholderText('chat:chatInputHelperText', { exact: false }), {
      target: { value: 'Meine Nachricht' },
    })
    expect(buttonSendMessage).toBeEnabled()
    fireEvent.click(buttonSendMessage)
    expect(submitMessage).toHaveBeenCalledTimes(1)
  })

  it('should display helper alert when not dismissed', () => {
    const { getByText } = render([], false, false)
    expect(getByText('chat:conversationHelperText')).toBeTruthy()
  })

  it('should hide helper alert after closing it', () => {
    const { getByText, getByLabelText, queryByText } = render([], false, false)
    expect(getByText('chat:conversationHelperText')).toBeTruthy()

    fireEvent.click(getByLabelText('Close'))

    expect(queryByText('chat:conversationHelperText')).toBeNull()
  })

  describe('privacy policy', () => {
    beforeEach(() => {
      localStorage.clear()
    })

    it('should show privacy policy screen when not yet accepted', () => {
      const { getByText, queryByRole } = render([], false, false)
      expect(getByText('chat:settings:privacyPolicy')).toBeTruthy()
      expect(queryByRole('button', { name: 'chat:sendButton' })).toBeNull()
    })

    it('should show chat after accepting privacy policy', () => {
      const { getByText, getByRole } = render([], false, false)
      expect(getByText('chat:settings:privacyPolicy')).toBeTruthy()

      fireEvent.click(getByRole('checkbox'))

      expect(getByRole('button', { name: 'chat:sendButton' })).toBeTruthy()
    })
  })
})
