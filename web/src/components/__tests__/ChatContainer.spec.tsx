import { fireEvent } from '@testing-library/react'
import { DateTime } from 'luxon'
import React, { ReactElement } from 'react'

import { getChatName } from 'shared'
import { ChatMessageModel, RegionModel, RegionModelBuilder } from 'shared/api'

import useChat from '../../hooks/useChat'
import { CHAT_PRIVACY_POLICIES_STORAGE_KEY } from '../../hooks/useLocalStorage'
import { mockUseQueryFromEndpointWithData } from '../../testing/mockUseQueryFromEndpoint'
import { renderRoute } from '../../testing/render'
import { chatIdKey } from '../../utils/chat'
import ChatContainer from '../ChatContainer'
import { LanguageChangePath } from '../LanguageSelection'

jest.mock('shared', () => ({
  ...jest.requireActual('shared'),
  uuid: jest.fn(() => '11111111-2222-3333-4444-555555555555'),
}))
jest.mock('../../hooks/useQueryFromEndpoint')

type ChatContainerWithChatProps = {
  region: RegionModel
  languageCode: string
  languageChangePaths: LanguageChangePath[]
}

const ChatContainerWithChat = ({
  region,
  languageCode,
  languageChangePaths,
}: ChatContainerWithChatProps): ReactElement => {
  const chat = useChat({ region, languageCode })
  return (
    <ChatContainer
      region={region}
      languageCode={languageCode}
      languageChangePaths={languageChangePaths}
      chatProps={chat}
    />
  )
}

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

  it('should render dialog content when the chat query param is set', () => {
    const { getByText, router } = renderRoute(
      <ChatContainerWithChat region={region} languageCode='de' languageChangePaths={languageChangePaths} />,
      {
        pathname,
        routePattern,
        searchParams: '?chat=true&test=asdf',
      },
    )
    expect(getByText('chat:initial.description')).toBeTruthy()
    expect(router.state.location.search).toBe('?chat=true&test=asdf')
  })

  it('should render nothing when the chat query param is not set', () => {
    const { queryByText } = renderRoute(
      <ChatContainerWithChat region={region} languageCode='de' languageChangePaths={languageChangePaths} />,
      {
        pathname,
        routePattern,
        searchParams: '?test=asdf',
      },
    )
    expect(queryByText('chat:initial.description')).toBeFalsy()
  })

  it('should close the dialog when the minimize button is clicked', () => {
    const { queryByText, getByLabelText, router } = renderRoute(
      <ChatContainerWithChat region={region} languageCode='de' languageChangePaths={languageChangePaths} />,
      {
        pathname,
        routePattern,
        searchParams: '?test=asdf&chat=true',
      },
    )
    expect(queryByText('chat:initial.description')).toBeTruthy()

    fireEvent.click(getByLabelText('common:actions.minimize'))

    expect(router.state.location.search).toBe('?test=asdf')
    expect(queryByText('chat:initial.title')).toBeFalsy()
    expect(queryByText('chat:initial.description')).toBeFalsy()
  })

  it('should open chat message links in a new tab when an external chat id is set', () => {
    const href = 'https://example.com/'
    mockUseQueryFromEndpointWithData({
      messages: [
        new ChatMessageModel({
          id: 1,
          content: `<a href="${href}">external link</a>`,
          created: DateTime.fromISO('2026-03-10T10:28:00.000Z'),
          userIsAuthor: false,
          automaticAnswer: false,
        }),
      ],
      botTyping: false,
    })
    const windowOpen = jest.spyOn(window, 'open').mockReturnValue(null)

    const { getByRole } = renderRoute(
      <ChatContainerWithChat region={region} languageCode='de' languageChangePaths={languageChangePaths} />,
      {
        pathname,
        routePattern,
        searchParams: '?chat=true&chatId=external-id',
      },
    )

    fireEvent.click(getByRole('link', { name: 'external link' }))
    expect(windowOpen).toHaveBeenCalledWith(href, '_blank', 'noreferrer')

    windowOpen.mockRestore()
  })

  it('should follow chat message links via the router when no external chat id is set', () => {
    const href = 'https://integreat.app/augsburg/en'
    mockUseQueryFromEndpointWithData({
      messages: [
        new ChatMessageModel({
          id: 1,
          content: `<a href="${href}">internal link</a>`,
          created: DateTime.fromISO('2026-03-10T10:28:00.000Z'),
          userIsAuthor: false,
          automaticAnswer: false,
        }),
      ],
      botTyping: false,
    })
    const windowOpen = jest.spyOn(window, 'open').mockReturnValue(null)

    const { getByRole, router } = renderRoute(
      <ChatContainerWithChat region={region} languageCode='de' languageChangePaths={languageChangePaths} />,
      {
        pathname,
        routePattern: '/:regionCode/:languageCode/*',
        searchParams: '?chat=true',
      },
    )

    fireEvent.click(getByRole('link', { name: 'internal link' }))
    expect(router.state.location.pathname).toBe('/augsburg/en')
    expect(windowOpen).not.toHaveBeenCalled()

    windowOpen.mockRestore()
  })

  it('should hide the dialog header when an external chat id is set', () => {
    const { queryByLabelText, queryByText } = renderRoute(
      <ChatContainerWithChat region={region} languageCode='de' languageChangePaths={languageChangePaths} />,
      {
        pathname,
        routePattern,
        searchParams: '?chat=true&chatId=external-id',
      },
    )

    expect(queryByLabelText('common:actions.minimize')).toBeNull()
    expect(queryByText(getChatName('IntegreatTestCms'))).toBeNull()
    expect(queryByText('chat:subtitle')).toBeNull()
  })

  it('should show the dialog header when no external chat id is set', () => {
    const { getByLabelText, getByText } = renderRoute(
      <ChatContainerWithChat region={region} languageCode='de' languageChangePaths={languageChangePaths} />,
      {
        pathname,
        routePattern,
        searchParams: '?chat=true',
      },
    )

    expect(getByLabelText('common:actions.minimize')).toBeTruthy()
    expect(getByText(getChatName('IntegreatTestCms'))).toBeTruthy()
    expect(getByText('chat:subtitle')).toBeTruthy()
  })

  it('should reinitialize a null chat id previously written to local storage', () => {
    localStorage.setItem(chatIdKey(region.code), 'null')

    renderRoute(<ChatContainerWithChat region={region} languageCode='de' languageChangePaths={languageChangePaths} />, {
      pathname,
      routePattern,
    })

    expect(localStorage.getItem(chatIdKey(region.code))).toBe(JSON.stringify('11111111-2222-3333-4444-555555555555'))
  })

  it('should switch the language', () => {
    const { getByText, router } = renderRoute(
      <ChatContainerWithChat region={region} languageCode='de' languageChangePaths={languageChangePaths} />,
      {
        pathname,
        routePattern,
        searchParams: '?chat=true',
      },
    )
    expect(router.state.location.pathname).toBe(`/${region.code}/de`)
    fireEvent.click(getByText('Deutsch'))
    fireEvent.click(getByText('English'))
    expect(router.state.location.pathname).toBe(`/${region.code}/en`)
    expect(router.state.location.search).toBe('?chat=true')
  })
})
