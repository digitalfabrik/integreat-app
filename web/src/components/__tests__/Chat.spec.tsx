import { fireEvent } from '@testing-library/react'
import React from 'react'

import ChatMessageModel from 'shared/api/models/ChatMessageModel'

import { renderWithTheme } from '../../testing/render'
import Chat from '../Chat'

const submitMessage = jest.fn()
jest.mock('react-i18next')
window.HTMLElement.prototype.scrollIntoView = jest.fn()

const render = (
  messages: ChatMessageModel[],
  hasError: boolean,
  isLoading: boolean,
  submitMessage: (text: string, deviceId?: string | undefined, refreshMessages?: () => void | undefined) => void,
) =>
  renderWithTheme(
    <Chat
      messages={messages}
      hasError={hasError}
      isLoading={isLoading}
      submitMessage={submitMessage}
      isTyping={false}
    />,
  )

describe('Chat', () => {
  it('sending button should be disabled if no input text is provided', () => {
    const { getByRole } = render([], false, false, submitMessage)
    const buttonSendMessage = getByRole('button', {
      name: 'chat:sendButton',
    })
    expect(buttonSendMessage).toBeDisabled()
  })

  it('should be able to send a message if text is provided', () => {
    const { getByRole, getByLabelText } = render([], false, false, submitMessage)
    const buttonSendMessage = getByRole('button', {
      name: 'chat:sendButton',
    })

    fireEvent.change(getByLabelText('chat:inputPlaceholder', { exact: false }), {
      target: {
        value: 'Meine Nachricht',
      },
    })
    expect(buttonSendMessage).toBeEnabled()
    fireEvent.click(buttonSendMessage)
    expect(submitMessage).toHaveBeenCalledTimes(1)
  })
})
