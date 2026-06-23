import { fireEvent } from '@testing-library/react'
import React from 'react'

import { CHAT_POPUP_HIGHLIGHT_VISIBLE_STORAGE_KEY } from '../../hooks/useLocalStorage'
import { renderWithTheme } from '../../testing/render'
import ChatPopupHighlight from '../ChatPopupHighlight'

jest.mock('react-i18next')

describe('ChatPopupHighlight', () => {
  const chatName = 'Frag Integreat'

  afterEach(() => {
    localStorage.clear()
  })

  it('should render popup when anchorEl is provided', () => {
    const anchorEl = document.createElement('button')
    const { getByText } = renderWithTheme(<ChatPopupHighlight anchorEl={anchorEl} chatName={chatName} />)

    expect(getByText('chat:welcomeGreeting')).toBeTruthy()
    expect(getByText('chat:welcomeText')).toBeTruthy()
    expect(localStorage.getItem(CHAT_POPUP_HIGHLIGHT_VISIBLE_STORAGE_KEY)).toBe('true')
  })

  it('should not render popup when anchorEl is null', () => {
    const { queryByText } = renderWithTheme(<ChatPopupHighlight anchorEl={null} chatName={chatName} />)

    expect(queryByText('chat:welcomeGreeting')).toBeFalsy()
    expect(queryByText('chat:welcomeText')).toBeFalsy()
  })

  it('should hide popup when close button is clicked', () => {
    const anchorEl = document.createElement('button')
    const { getByLabelText, queryByText } = renderWithTheme(
      <ChatPopupHighlight anchorEl={anchorEl} chatName={chatName} />,
    )

    fireEvent.click(getByLabelText('chat:common:close'))

    expect(queryByText('chat:welcomeGreeting')).toBeFalsy()
    expect(queryByText('chat:welcomeText')).toBeFalsy()
    expect(localStorage.getItem(CHAT_POPUP_HIGHLIGHT_VISIBLE_STORAGE_KEY)).toBe('false')
  })

  it('should not render popup when previously dismissed', () => {
    localStorage.setItem(CHAT_POPUP_HIGHLIGHT_VISIBLE_STORAGE_KEY, 'false')
    const anchorEl = document.createElement('button')
    const { queryByText } = renderWithTheme(<ChatPopupHighlight anchorEl={anchorEl} chatName={chatName} />)

    expect(queryByText('chat:welcomeGreeting')).toBeFalsy()
    expect(queryByText('chat:welcomeText')).toBeFalsy()
  })
})
