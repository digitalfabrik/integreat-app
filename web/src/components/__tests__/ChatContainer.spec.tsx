import { fireEvent } from '@testing-library/react'
import React, { ReactElement } from 'react'

import { mockUseLoadFromEndpointWithData } from 'shared/api/endpoints/testing/mockUseLoadFromEndpoint'

import { renderWithRouterAndTheme, renderWithTheme } from '../../testing/render'
import ChatContainer from '../ChatContainer'

jest.mock('react-i18next')
jest.mock('focus-trap-react', () => ({ children }: { children: ReactElement }) => <div>{children}</div>)

jest.mock('shared/api', () => ({
  ...jest.requireActual('shared/api'),
  useLoadFromEndpoint: jest.fn(),
}))

describe('ChatContainer', () => {
  mockUseLoadFromEndpointWithData({ messages: [] })

  it('should open chat modal and show content on chat button click', () => {
    const { getByTestId, getByText } = renderWithRouterAndTheme(<ChatContainer city='augsburg' language='de' />)
    const chatButtonContainer = getByTestId('chat-button-container')
    expect(chatButtonContainer).toBeTruthy()
    fireEvent.click(chatButtonContainer)
    expect(getByText('chat:header')).toBeTruthy()
    expect(getByText('chat:conversationTitle')).toBeTruthy()
    expect(getByText('chat:conversationText')).toBeTruthy()
  })

  it('should show minimized toolbar on minimize button click', () => {
    const { getByTestId, getByLabelText } = renderWithTheme(<ChatContainer city='augsburg' language='de' />)
    const chatButtonContainer = getByTestId('chat-button-container')
    expect(chatButtonContainer).toBeTruthy()
    fireEvent.click(chatButtonContainer)
    const minimizeButton = getByLabelText('minimize')
    fireEvent.click(minimizeButton)
    expect(getByTestId('chat-minimized-toolbar')).toBeTruthy()
  })

  it('should close chat if close button was clicked', () => {
    const { getByTestId, queryByTestId, getByLabelText, queryByText } = renderWithTheme(
      <ChatContainer city='augsburg' language='de' />,
    )
    const chatButtonContainer = getByTestId('chat-button-container')
    expect(chatButtonContainer).toBeTruthy()
    fireEvent.click(chatButtonContainer)
    const closeButton = getByLabelText('close')
    fireEvent.click(closeButton)
    expect(queryByTestId('chat-minimized-toolbar')).toBeFalsy()
    expect(queryByText('chat:header')).toBeFalsy()
    expect(queryByText('chat:conversationTitle')).toBeFalsy()
    expect(queryByText('chat:conversationText')).toBeFalsy()
  })

  it('should maximize chat on maximize button click if chat was minimized', () => {
    const { getByTestId, getByText, getByLabelText } = renderWithTheme(<ChatContainer city='augsburg' language='de' />)
    const chatButtonContainer = getByTestId('chat-button-container')
    expect(chatButtonContainer).toBeTruthy()
    fireEvent.click(chatButtonContainer)
    const minimizeButton = getByLabelText('minimize')
    fireEvent.click(minimizeButton)
    const maximizeButton = getByLabelText('maximize')
    fireEvent.click(maximizeButton)
    expect(getByText('chat:header')).toBeTruthy()
    expect(getByText('chat:conversationTitle')).toBeTruthy()
    expect(getByText('chat:conversationText')).toBeTruthy()
  })
})
