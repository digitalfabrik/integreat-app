import { fireEvent } from '@testing-library/react'
import React, { ReactElement } from 'react'

import { getChatName } from 'shared'
import { CityModelBuilder } from 'shared/api'
import { mockUseLoadFromEndpointWithData } from 'shared/api/endpoints/testing/mockUseLoadFromEndpoint'

import { renderRoute } from '../../testing/render'
import ChatContainer from '../ChatContainer'

jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  useTranslation: (namespace?: string) => ({
    t: (key: string) => (namespace ? `${namespace}:${key}` : key),
  }),
  Trans: ({ i18nKey }: { i18nKey: string }) => i18nKey,
}))
jest.mock('focus-trap-react', () => ({ children }: { children: ReactElement }) => <div>{children}</div>)

jest.mock('shared/api', () => ({
  ...jest.requireActual('shared/api'),
  useLoadFromEndpoint: jest.fn(),
}))
jest.mock('../../hooks/useLocalStorage', () => () => ({
  value: { augsburg: true },
  updateLocalStorageItem: jest.fn(),
}))

describe('ChatContainer', () => {
  mockUseLoadFromEndpointWithData({ messages: [] })
  const routePattern = '/:cityCode/:languageCode'
  const city = new CityModelBuilder(1).build()[0]!
  const pathname = `/${city.code}/de`

  it('should open chat modal and show content on chat button click', () => {
    const { getByText, getAllByText } = renderRoute(<ChatContainer city={city} language='de' />, {
      pathname,
      routePattern,
    })
    const chatButtonContainer = getAllByText(getChatName('IntegreatTestCms'))[0]!
    expect(chatButtonContainer).toBeTruthy()
    fireEvent.click(chatButtonContainer)
    expect(getByText('chat:conversationTitle')).toBeTruthy()
    expect(getByText('chat:conversationText')).toBeTruthy()
  })

  it('should close chat if close button was clicked', () => {
    const { getAllByLabelText, queryByText, getAllByText } = renderRoute(<ChatContainer city={city} language='de' />, {
      pathname,
      routePattern,
    })
    const chatButtonContainer = getAllByText(getChatName('IntegreatTestCms'))[0]!
    expect(chatButtonContainer).toBeTruthy()
    fireEvent.click(chatButtonContainer!)
    const closeButton = getAllByLabelText('common:minimize')[0]!
    fireEvent.click(closeButton)
    expect(queryByText('chat:conversationTitle')).toBeFalsy()
    expect(queryByText('chat:conversationText')).toBeFalsy()
  })

  it('should open chat if query param is set', () => {
    const { getByText, router } = renderRoute(<ChatContainer city={city} language='de' />, {
      pathname,
      routePattern,
      searchParams: '?chat=true&test=asdf',
    })
    expect(getByText('chat:conversationTitle')).toBeTruthy()
    expect(getByText('chat:conversationText')).toBeTruthy()
    expect(router.state.location.search).toBe('?test=asdf')
  })

  it('should only update query params if open chat query param is set', () => {
    const { getAllByText, router } = renderRoute(<ChatContainer city={city} language='de' />, {
      pathname,
      routePattern,
      searchParams: '?',
    })
    expect(getAllByText(getChatName('IntegreatTestCms'))).toHaveLength(2)
    expect(router.state.location.search).toBe('?')
  })
})
