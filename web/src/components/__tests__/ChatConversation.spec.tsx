import React from 'react'

import ChatMessageModel from 'shared/api/models/ChatMessageModel'

import { renderWithRouterAndTheme } from '../../testing/render'
import ChatConversation from '../ChatConversation'
import { testMessages } from '../__mocks__/ChatMessages'

jest.mock('react-i18next')
window.HTMLElement.prototype.scrollIntoView = jest.fn()

const render = (messages: ChatMessageModel[], hasConversationStarted: boolean, hasError: boolean) =>
  renderWithRouterAndTheme(
    <ChatConversation messages={messages} hasConversationStarted={hasConversationStarted} hasError={hasError} />,
  )

describe('ChatConversation', () => {
  it('should display welcome text if conversation has not started', () => {
    const { getByText } = render([], false, false)
    expect(getByText('chat:conversationTitle')).toBeTruthy()
    expect(getByText('chat:conversationText')).toBeTruthy()
  })
  it('should display messages if conversation has started and the initial message', () => {
    const { getByText, getByTestId } = render(testMessages, true, false)
    expect(getByText('chat:initialMessage')).toBeTruthy()
    expect(getByTestId(testMessages[0]!.id)).toBeTruthy()
    expect(getByTestId(testMessages[1]!.id)).toBeTruthy()
  })
  it('should display error messages if error occurs', () => {
    const { getByText } = render([], true, true)
    expect(getByText('chat:errorMessage')).toBeTruthy()
  })
})
