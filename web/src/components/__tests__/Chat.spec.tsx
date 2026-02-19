import { fireEvent } from '@testing-library/react'
import React from 'react'

import { CityModelBuilder, ChatMessageModel } from 'shared/api'

import { renderWithTheme } from '../../testing/render'
import Chat from '../Chat'

const submitMessage = jest.fn()
jest.mock('react-i18next')
window.HTMLElement.prototype.scrollIntoView = jest.fn()

const acceptPrivacyPolicy = jest.fn()

const render = (
  messages: ChatMessageModel[],
  hasError: boolean,
  isLoading: boolean,
  submitMessage: (text: string, deviceId?: string | undefined, refreshMessages?: () => void | undefined) => void,
  privacyPolicyAccepted = true,
) =>
  renderWithTheme(
    <Chat
      city={new CityModelBuilder(1).build()[0]!}
      acceptPrivacyPolicy={acceptPrivacyPolicy}
      privacyPolicyAccepted={privacyPolicyAccepted}
      messages={messages}
      hasError={hasError}
      isLoading={isLoading}
      submitMessage={submitMessage}
      isTyping={false}
      languageCode='de'
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
    const { getByRole, getByPlaceholderText } = render([], false, false, submitMessage)
    const buttonSendMessage = getByRole('button', {
      name: 'chat:sendButton',
    })

    fireEvent.change(getByPlaceholderText('chat:chatInputHelperText', { exact: false }), {
      target: {
        value: 'Meine Nachricht',
      },
    })
    expect(buttonSendMessage).toBeEnabled()
    fireEvent.click(buttonSendMessage)
    expect(submitMessage).toHaveBeenCalledTimes(1)
  })

  it('should display helper alert when not dismissed', () => {
    const { getByText } = render([], false, false, submitMessage)
    expect(getByText('chat:conversationHelperText')).toBeTruthy()
  })

  it('should hide helper alert after closing it', () => {
    const { getByText, getByLabelText, queryByText } = render([], false, false, submitMessage)
    expect(getByText('chat:conversationHelperText')).toBeTruthy()

    const closeButton = getByLabelText('Close')
    fireEvent.click(closeButton)

    expect(queryByText('chat:conversationHelperText')).toBeNull()
  })
})
