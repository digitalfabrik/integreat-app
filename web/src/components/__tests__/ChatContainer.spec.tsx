import { fireEvent } from '@testing-library/react'
import React from 'react'

import { getChatName } from 'shared'
import { RegionModelBuilder } from 'shared/api'
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
  const routePattern = '/:regionCode/:languageCode'
  const region = new RegionModelBuilder(1).build()[0]!
  const pathname = `/${region.code}/de`
  const languageChangePaths = [
    { code: 'de', name: 'Deutsch', path: '/augsburg/de' },
    { code: 'en', name: 'English', path: '/augsburg/en' },
  ]

  it('should open chat dialog and show content on chat button click', () => {
    const { getByText, queryByText, getByLabelText, router } = renderRoute(
      <ChatContainer region={region} languageCode='de' languageChangePaths={languageChangePaths} />,
      {
        pathname,
        routePattern,
        searchParams: '?test=asdf',
      },
    )
    const chatButtonContainer = getByLabelText(getChatName('IntegreatTestCms'))
    expect(chatButtonContainer).toBeTruthy()

    expect(router.state.location.search).toBe('?test=asdf')

    fireEvent.click(chatButtonContainer)

    expect(router.state.location.search).toBe('?test=asdf&chat=true')

    expect(getByText('chat:conversationText')).toBeTruthy()
    expect(getByText('chat:conversationHelperText')).toBeTruthy()

    fireEvent.click(getByLabelText('layout:common:close'))

    expect(router.state.location.search).toBe('?test=asdf')

    expect(queryByText('chat:conversationText')).toBeFalsy()
  })

  it('should close chat if close button was clicked', () => {
    const { getByLabelText, queryByText } = renderRoute(
      <ChatContainer region={region} languageCode='de' languageChangePaths={languageChangePaths} />,
      {
        pathname,
        routePattern,
      },
    )
    const chatButtonContainer = getByLabelText(getChatName('IntegreatTestCms'))
    expect(chatButtonContainer).toBeTruthy()

    fireEvent.click(chatButtonContainer!)

    const closeButton = getByLabelText('layout:common:close')

    fireEvent.click(closeButton)

    expect(queryByText('chat:conversationTitle')).toBeFalsy()
    expect(queryByText('chat:conversationText')).toBeFalsy()
  })

  it('should open chat if query param is set', () => {
    const { getByText, router } = renderRoute(
      <ChatContainer region={region} languageCode='de' languageChangePaths={languageChangePaths} />,
      {
        pathname,
        routePattern,
        searchParams: '?chat=true&test=asdf',
      },
    )
    expect(getByText('chat:conversationText')).toBeTruthy()
    expect(getByText('chat:conversationHelperText')).toBeTruthy()
    expect(router.state.location.search).toBe('?chat=true&test=asdf')
  })

  it('should correctly update query params', () => {
    const { getAllByText, router } = renderRoute(
      <ChatContainer region={region} languageCode='de' languageChangePaths={languageChangePaths} />,
      {
        pathname,
        routePattern,
        searchParams: '?',
      },
    )
    expect(getAllByText(getChatName('IntegreatTestCms'))).toHaveLength(1)
    expect(router.state.location.search).toBe('?')
  })

  it('should switch the language', () => {
    const { getByText, getByLabelText, router } = renderRoute(
      <ChatContainer region={region} languageCode='de' languageChangePaths={languageChangePaths} />,
      {
        pathname,
        routePattern,
      },
    )
    const chatButtonContainer = getByLabelText(getChatName('IntegreatTestCms'))
    fireEvent.click(chatButtonContainer!)
    expect(router.state.location.pathname).toBe(`/${region.code}/de`)
    fireEvent.click(getByText('Deutsch'))
    fireEvent.click(getByText('English'))
    expect(router.state.location.pathname).toBe(`/${region.code}/en`)
    expect(router.state.location.search).toBe('?chat=true')
  })
})
