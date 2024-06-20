import { fireEvent } from '@testing-library/react'
import React from 'react'

import ChatMessageModel from 'shared/api/models/ChatMessageModel'

import { renderWithTheme } from '../../testing/render'
import Chat from '../Chat'

const refresh = jest.fn()
const submitMessage = jest.fn()
jest.mock('react-i18next')
window.HTMLElement.prototype.scrollIntoView = jest.fn()
const render = (
  messages: ChatMessageModel[],
  hasError: boolean,
  isLoading: boolean,
  submitMessage: (text: string, deviceId?: string | undefined, refreshMessages?: () => void | undefined) => void,
  refreshMessages: () => void | undefined,
  deviceId?: string,
) =>
  renderWithTheme(
    <Chat
      messages={messages}
      deviceId={deviceId}
      hasError={hasError}
      isLoading={isLoading}
      submitMessage={submitMessage}
      refreshMessages={refreshMessages}
    />,
  )

describe('Chat', () => {
  it('should sending button be disabled if no input text is provided', () => {
    const { getByRole } = render([], false, false, submitMessage, refresh, undefined)
    const buttonSendMessage = getByRole('button', {
      name: 'chat:sendButton',
    })
    expect(buttonSendMessage).toBeDisabled()
  })
  it('should be able to send a message if text is provided', () => {
    const { getByRole, getByPlaceholderText } = render([], false, false, submitMessage, refresh, undefined)
    const buttonSendMessage = getByRole('button', {
      name: 'chat:sendButton',
    })

    fireEvent.change(getByPlaceholderText('chat:inputPlaceholder'), {
      target: {
        value: 'Meine Nachricht',
      },
    })
    expect(buttonSendMessage).toBeEnabled()
    fireEvent.click(buttonSendMessage)
    expect(submitMessage).toHaveBeenCalledTimes(1)
  })
})
