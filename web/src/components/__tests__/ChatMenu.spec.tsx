import { fireEvent } from '@testing-library/react'
import React from 'react'

import { renderWithTheme } from '../../testing/render'
import ChatMenu from '../ChatMenu'

jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  useTranslation: () => ({ t: (key: string) => key }),
}))

describe('ChatMenu', () => {
  const updateChatId = jest.fn()
  beforeEach(jest.clearAllMocks)

  const ticketUrl = 'https://www.example.com/#ticket/zoom/1'

  it('should open menu on icon button click', () => {
    const { getByLabelText, getByText } = renderWithTheme(
      <ChatMenu chatId='123' ticketUrl={ticketUrl} resetChat={updateChatId} />,
    )

    const menuButton = getByLabelText('chatOptions')
    fireEvent.click(menuButton)

    expect(getByText('newChat')).toBeTruthy()
  })

  it('should disable new chat button when chatId is null', () => {
    const { getByLabelText, getByText } = renderWithTheme(
      <ChatMenu chatId={null} ticketUrl={ticketUrl} resetChat={updateChatId} />,
    )

    const menuButton = getByLabelText('chatOptions')
    fireEvent.click(menuButton)

    expect(getByText('newChat').closest('li')).toHaveClass('Mui-disabled')
  })

  it('should show confirmation dialog when new chat is clicked', () => {
    const { getByLabelText, getByText } = renderWithTheme(
      <ChatMenu chatId='123' ticketUrl={ticketUrl} resetChat={updateChatId} />,
    )

    fireEvent.click(getByLabelText('chatOptions'))
    fireEvent.click(getByText('newChat'))

    expect(getByText('newChatConfirmation')).toBeTruthy()
    expect(getByText('newChatConfirmationMessage')).toBeTruthy()
  })

  it('should close dialog on cancel', () => {
    const { getByLabelText, getByText, queryByText } = renderWithTheme(
      <ChatMenu chatId='123' ticketUrl={ticketUrl} resetChat={updateChatId} />,
    )

    fireEvent.click(getByLabelText('chatOptions'))
    fireEvent.click(getByText('newChat'))
    expect(queryByText('newChatConfirmation')).toBeTruthy()

    fireEvent.click(getByText('layout:cancel'))
    expect(queryByText('newChatConfirmation')).toBeFalsy()
    expect(updateChatId).not.toHaveBeenCalled()
  })

  it('should create new chat on confirm', () => {
    const { getByLabelText, getByText, getByRole, queryByText } = renderWithTheme(
      <ChatMenu chatId='123' ticketUrl={ticketUrl} resetChat={updateChatId} />,
    )

    fireEvent.click(getByLabelText('chatOptions'))
    fireEvent.click(getByText('newChat'))
    fireEvent.click(getByRole('button', { name: 'newChat' }))

    expect(updateChatId).toHaveBeenCalled()
    expect(queryByText('newChatConfirmation')).toBeFalsy()
  })

  it('should show the ticket url as a qr code dialog', () => {
    const { getByLabelText, getByText, queryByText } = renderWithTheme(
      <ChatMenu chatId='123' ticketUrl={ticketUrl} resetChat={updateChatId} />,
    )

    fireEvent.click(getByLabelText('chatOptions'))
    expect(queryByText(ticketUrl)).toBeFalsy()
    fireEvent.click(getByText('consultationQrCodeTitle'))

    expect(getByText('consultationQrCodeDescription')).toBeTruthy()
    expect(queryByText(ticketUrl)).toBeTruthy()
  })

  it('should disable qr code button when ticketUrl is null', () => {
    const { getByLabelText, getByText } = renderWithTheme(
      <ChatMenu chatId='123' ticketUrl={null} resetChat={updateChatId} />,
    )

    fireEvent.click(getByLabelText('chatOptions'))

    expect(getByText('consultationQrCodeTitle').closest('li')).toHaveClass('Mui-disabled')
  })
})
