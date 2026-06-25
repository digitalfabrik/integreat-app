import { fireEvent } from '@testing-library/react'
import React from 'react'

import { getChatName } from 'shared'
import { RegionModelBuilder } from 'shared/api'

import { CHAT_PRIVACY_POLICIES_STORAGE_KEY } from '../../hooks/useLocalStorage'
import { mockUseQueryFromEndpointWithData } from '../../testing/mockUseQueryFromEndpoint'
import { renderRoute } from '../../testing/render'
import { chatSeenMessagesKey } from '../../utils/chat'
import ChatContainer from '../ChatContainer'

jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  useTranslation: (namespace?: string) => ({
    t: (key: string) => (namespace ? `${namespace}:${key}` : key),
  }),
  Trans: ({ i18nKey }: { i18nKey: string }) => i18nKey,
}))
jest.mock('../../hooks/useQueryFromEndpoint')

describe('ChatContainer', () => {
  const routePattern = '/:regionCode/:languageCode'
  const region = new RegionModelBuilder(1).build()[0]!
  const pathname = `/${region.code}/de`
  const languageChangePaths = [
    { code: 'de', name: 'Deutsch', path: '/augsburg/de' },
    { code: 'en', name: 'English', path: '/augsburg/en' },
  ]

  beforeEach(() => {
    mockUseQueryFromEndpointWithData({ messages: [], botTyping: false })
    localStorage.setItem(CHAT_PRIVACY_POLICIES_STORAGE_KEY, JSON.stringify({ [region.code]: true }))
  })

  afterEach(() => {
    localStorage.clear()
  })

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
    expect(getByText('chat,error:conversationHelperText')).toBeTruthy()

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
    expect(getByText('chat,error:conversationHelperText')).toBeTruthy()
    expect(router.state.location.search).toBe('?chat=true&test=asdf')
  })

  it('should show only incoming messages in the unread badge', () => {
    localStorage.setItem(chatSeenMessagesKey(region.code), '0')
    mockUseQueryFromEndpointWithData({
      messages: [
        { userIsAuthor: true, content: 'my message' },
        { userIsAuthor: false, content: 'bot answer' },
        { userIsAuthor: false, content: 'another bot answer' },
      ],
      botTyping: false,
    })

    const { getByText } = renderRoute(
      <ChatContainer region={region} languageCode='de' languageChangePaths={languageChangePaths} />,
      {
        pathname,
        routePattern,
      },
    )

    expect(getByText('2')).toBeTruthy()
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

  it('should hide the dialog header when an external chat id is set', () => {
    const { queryByLabelText, queryByText } = renderRoute(
      <ChatContainer region={region} languageCode='de' languageChangePaths={languageChangePaths} />,
      {
        pathname,
        routePattern,
        searchParams: '?chat=true&chatId=external-id',
      },
    )

    expect(queryByLabelText('layout:common:close')).toBeNull()
    expect(queryByText(getChatName('IntegreatTestCms'))).toBeNull()
  })

  it('should show the dialog header when no external chat id is set', () => {
    const { getByLabelText, getByText } = renderRoute(
      <ChatContainer region={region} languageCode='de' languageChangePaths={languageChangePaths} />,
      {
        pathname,
        routePattern,
        searchParams: '?chat=true',
      },
    )

    expect(getByLabelText('layout:common:close')).toBeTruthy()
    expect(getByText(getChatName('IntegreatTestCms'))).toBeTruthy()
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
