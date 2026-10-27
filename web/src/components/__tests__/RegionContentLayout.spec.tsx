import { fireEvent, RenderResult } from '@testing-library/react'
import React, { ReactElement } from 'react'

import { getChatName } from 'shared'
import { LanguageModelBuilder, RegionModel, RegionModelBuilder } from 'shared/api'

import { mockDimensions } from '../../hooks/__mocks__/useDimensions'
import useDimensions from '../../hooks/useDimensions'
import { CHAT_PRIVACY_POLICIES_STORAGE_KEY } from '../../hooks/useLocalStorage'
import { mockUseQueryFromEndpointWithData } from '../../testing/mockUseQueryFromEndpoint'
import { renderAllRoutes } from '../../testing/render'
import RegionContentLayout from '../RegionContentLayout'

jest.mock('../../hooks/useDimensions')
jest.mock('../../hooks/useQueryFromEndpoint')
jest.mock('../Footer', () => () => <div>Footer</div>)
jest.mock('../RegionContentHeader', () => () => <div>RegionContentHeader</div>)
jest.mock('../FeedbackContainer', () => () => <div>FeedbackContainer</div>)

describe('RegionContentLayout', () => {
  beforeEach(jest.clearAllMocks)
  const { mocked } = jest
  const language = 'de'
  const regionModel = new RegionModelBuilder(1).build()[0]!
  const chatEnabledRegionModel = new RegionModel({
    name: regionModel.name,
    code: regionModel.code,
    live: true,
    languages: new LanguageModelBuilder(2).build(),
    placesEnabled: true,
    eventsEnabled: true,
    localNewsEnabled: true,
    externalNewsEnabled: true,
    chatEnabled: true,
    bescheidCheckEnabled: false,
    sortingName: regionModel.sortingName,
    prefix: null,
    latitude: regionModel.latitude,
    longitude: regionModel.longitude,
    aliases: null,
    boundingBox: regionModel.boundingBox,
    chatPrivacyPolicyUrl: null,
  })

  const languageChangePaths = [
    { code: 'de', name: 'Deutsch', path: '/augsburg/de' },
    { code: 'en', name: 'English', path: '/augsburg/en' },
  ]

  const MockNode = () => <div />
  const renderRegionContentLayout = (
    isLoading: boolean,
    toolbar?: ReactElement,
    { region = regionModel, path = '/augsburg/de' }: { region?: RegionModel; path?: string } = {},
  ): RenderResult =>
    renderAllRoutes(path, {
      RegionContentElement: (
        <RegionContentLayout
          toolbar={toolbar}
          region={region}
          languageCode={language}
          languageChangePaths={languageChangePaths}
          pageTitle='Test Page'
          slug={null}
          isLoading={isLoading}>
          <MockNode />
        </RegionContentLayout>
      ),
    })

  it('should render a toolbar on desktop', () => {
    mocked(useDimensions).mockImplementation(() => ({ ...mockDimensions, mobile: false, desktop: true }))
    const { getByText } = renderRegionContentLayout(false, <div>Toolbar</div>)
    expect(getByText('Toolbar')).toBeTruthy()
  })

  it('should hide the toolbar on mobile', () => {
    mocked(useDimensions).mockImplementation(() => ({ ...mockDimensions, mobile: true }))
    const { queryByText } = renderRegionContentLayout(false, <div>Toolbar</div>)
    expect(queryByText('Toolbar')).toBeFalsy()
  })

  it('should show header and footer if not loading and on a big screen', () => {
    mocked(useDimensions).mockImplementation(() => ({ ...mockDimensions, mobile: false, desktop: true }))
    const { getByText } = renderRegionContentLayout(false)
    expect(getByText('RegionContentHeader')).toBeTruthy()
    expect(getByText('Footer')).toBeTruthy()
  })

  it('should not show footer if not loading and on a small screen', () => {
    mocked(useDimensions).mockImplementation(() => ({ ...mockDimensions, mobile: true }))
    const { getByText } = renderRegionContentLayout(false)
    expect(getByText('RegionContentHeader')).toBeTruthy()
    expect(() => getByText('Footer')).toThrow()
  })

  it('should not show footer if loading', () => {
    mocked(useDimensions).mockImplementation(() => ({ ...mockDimensions, mobile: true }))
    const { getByText } = renderRegionContentLayout(true)
    expect(getByText('RegionContentHeader')).toBeTruthy()
    expect(() => getByText('Footer')).toThrow()
  })

  it('should show FeedbackContainer', () => {
    const { getByText } = renderRegionContentLayout(false)
    expect(getByText('FeedbackContainer')).toBeTruthy()
  })

  describe('fab and chat dialog', () => {
    beforeEach(() => {
      mockUseQueryFromEndpointWithData({ messages: [], botTyping: false })
      localStorage.setItem(CHAT_PRIVACY_POLICIES_STORAGE_KEY, JSON.stringify({ [chatEnabledRegionModel.code]: true }))
    })

    afterEach(() => {
      localStorage.clear()
    })

    it('should open the chat dialog when the fab is clicked', () => {
      const { getByText, queryByText, getByLabelText } = renderRegionContentLayout(false, undefined, {
        region: chatEnabledRegionModel,
      })
      const chatButton = getByLabelText(getChatName('IntegreatTestCms'))

      fireEvent.click(chatButton)

      expect(getByText('chat:description')).toBeTruthy()
      expect(getByLabelText(getChatName('IntegreatTestCms'))).toBeTruthy()

      fireEvent.click(getByLabelText('common:actions.minimize'))

      expect(queryByText('chat:description')).toBeFalsy()
      expect(getByLabelText(getChatName('IntegreatTestCms'))).toBeTruthy()
    })

    it('should show only incoming messages in the unread badge', () => {
      mockUseQueryFromEndpointWithData({
        messages: [
          { userIsAuthor: true, content: 'my message' },
          { userIsAuthor: false, content: 'bot answer' },
          { userIsAuthor: false, content: 'another bot answer' },
        ],
        botTyping: false,
      })

      const { getByText } = renderRegionContentLayout(false, undefined, { region: chatEnabledRegionModel })

      expect(getByText('2')).toBeTruthy()
    })
  })
})
