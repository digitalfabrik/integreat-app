import { fireEvent } from '@testing-library/react'
import React, { ReactElement } from 'react'

import { mockUseLoadFromEndpointWithData } from 'shared/api/endpoints/testing/mockUseLoadFromEndpoint'

import { renderRoute } from '../../testing/render'
import ChatContainer from '../ChatContainer'

jest.mock('react-i18next')
jest.mock('focus-trap-react', () => ({ children }: { children: ReactElement }) => <div>{children}</div>)

jest.mock('shared/api', () => ({
  ...jest.requireActual('shared/api'),
  useLoadFromEndpoint: jest.fn(),
}))

describe('ChatContainer', () => {
  mockUseLoadFromEndpointWithData({ messages: [] })
  const pathname = '/testumgebung/de'
  const routePattern = '/:cityCode/:languageCode'

  it('should open chat modal and show content on chat button click', () => {
    const { getAllByText, getByText } = renderRoute(<ChatContainer city='augsburg' language='de' />, {
      pathname,
      routePattern,
    })
    const chatButtonContainer = getAllByText('chat:chat').find(node => node.tagName === 'SPAN')
    expect(chatButtonContainer).toBeTruthy()
    fireEvent.click(chatButtonContainer!)
    expect(getByText('chat:header')).toBeTruthy()
    expect(getByText('chat:conversationTitle')).toBeTruthy()
    expect(getByText('chat:conversationText')).toBeTruthy()
  })

  it('should close chat if close button was clicked', () => {
    const { getAllByLabelText, queryByText, getAllByText } = renderRoute(
      <ChatContainer city='augsburg' language='de' />,
      {
        pathname,
        routePattern,
      },
    )
    const chatButtonContainer = getAllByText('chat:chat').find(node => node.tagName !== 'SPAN')
    expect(chatButtonContainer).toBeTruthy()
    fireEvent.click(chatButtonContainer!)
    const closeButton = getAllByLabelText('common:minimize')[0]!
    fireEvent.click(closeButton)
    expect(queryByText('chat:header')).toBeFalsy()
    expect(queryByText('chat:conversationTitle')).toBeFalsy()
    expect(queryByText('chat:conversationText')).toBeFalsy()
  })

  it('should open chat if query param is set', () => {
    const { getByText, queryByText } = renderRoute(<ChatContainer city='augsburg' language='de' />, {
      pathname,
      routePattern,
      searchParams: '?chat=true',
    })
    expect(queryByText('chat:chat')).toBeFalsy()
    expect(getByText('chat:header')).toBeTruthy()
    expect(getByText('chat:conversationTitle')).toBeTruthy()
    expect(getByText('chat:conversationText')).toBeTruthy()
  })
})
