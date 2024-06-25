import React from 'react'

import ChatMessageModel from 'shared/api/models/ChatMessageModel'

import { renderWithRouterAndTheme } from '../../testing/render'
import ChatConversation from '../ChatConversation'

jest.mock('react-i18next')
window.HTMLElement.prototype.scrollIntoView = jest.fn()

const render = (messages: ChatMessageModel[], hasConversationStarted: boolean, hasError: boolean) =>
  renderWithRouterAndTheme(
    <ChatConversation messages={messages} hasConversationStarted={hasConversationStarted} hasError={hasError} />,
  )

describe('ChatConversation', () => {
  const testMessages: ChatMessageModel[] = [
    new ChatMessageModel({
      id: 1,
      body: '<b>Meine Frage lautet</b>, warum bei Integreat eigentlich alles gelb ist. <a rel="noopener" class="link-external" target="_blank" href="https://www.google.com" >Weitere Infos</a>',
      userIsAuthor: true,
    }),
    new ChatMessageModel({
      id: 2,
      body: 'Informationen zu Ihrer Frage finden Sie auf folgenden Seiten:',
      userIsAuthor: false,
    }),
  ]

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
