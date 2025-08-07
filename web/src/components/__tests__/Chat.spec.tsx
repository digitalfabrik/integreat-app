import { fireEvent } from '@testing-library/react'
import React from 'react'

import ChatMessageModel from 'shared/api/models/ChatMessageModel'
import { CityModelBuilder } from 'shared/dist/api'

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

    fireEvent.change(getByPlaceholderText('chat:chatInputHelperText'), {
      target: {
        value: 'Meine Nachricht',
      },
    })
    expect(buttonSendMessage).toBeEnabled()
    fireEvent.click(buttonSendMessage)
    expect(submitMessage).toHaveBeenCalledTimes(1)
  })
})
