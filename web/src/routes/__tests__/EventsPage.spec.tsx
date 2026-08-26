import { fireEvent } from '@testing-library/react'
import React from 'react'

import { EVENTS_ROUTE, pathnameFromRouteInformation } from 'shared'
import { EventModelBuilder, RegionModelBuilder } from 'shared/api'

import {
  mockUseQueryFromEndpointWithData,
  mockUseQueryFromEndpointWithError,
} from '../../testing/mockUseQueryFromEndpoint'
import { renderRoute } from '../../testing/render'
import EventsPage from '../EventsPage'
import { RoutePatterns } from '../index'

jest.mock('../../hooks/useQueryFromEndpoint')
jest.mock('../../hooks/useTtsPlayer', () => jest.fn())
jest.mock('../../hooks/useJsonLd', () => jest.fn())
jest.mock('../../components/EventList', () => () => null)
jest.mock('../../components/RegionContentToolbar', () => () => null)

describe('EventsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const region = new RegionModelBuilder(1).build()[0]!
  const languageCode = 'de'
  const arabicName = 'اَللُّغَةُ اَلْعَرَبِيَّة'
  const events = new EventModelBuilder('seed', 2, region.code, languageCode).build()
  const eventsPathname = pathnameFromRouteInformation({ route: EVENTS_ROUTE, regionCode: region.code, languageCode })
  const routePattern = `/:regionCode/:languageCode/${RoutePatterns[EVENTS_ROUTE]}`
  const detailRoutePattern = `${routePattern}/:eventId`

  const renderOverview = () =>
    renderRoute(
      <EventsPage region={region} pathname={eventsPathname} regionCode={region.code} languageCode={languageCode} />,
      { pathname: eventsPathname, routePattern },
    )

  const renderDetail = (pathname: string) =>
    renderRoute(
      <EventsPage region={region} pathname={pathname} regionCode={region.code} languageCode={languageCode} />,
      { pathname, routePattern: detailRoutePattern },
    )

  it('should render failure switcher on error', () => {
    mockUseQueryFromEndpointWithError('something went wrong')
    const { getByText } = renderOverview()

    expect(getByText('error:unknownError')).toBeTruthy()
  })

  it('should render nothing when region is missing', () => {
    mockUseQueryFromEndpointWithData(events)
    const { container } = renderRoute(
      <EventsPage region={null} pathname={eventsPathname} regionCode={region.code} languageCode={languageCode} />,
      { pathname: eventsPathname, routePattern },
    )

    expect(container).toBeEmptyDOMElement()
  })

  it('should link to all languages if no event is selected', () => {
    mockUseQueryFromEndpointWithData(events)
    const { getAllByText, getByRole } = renderOverview()
    fireEvent.click(getByRole('button', { name: 'layout:changeLanguage' }))

    expect(getAllByText('English')[0]?.closest('a')).toHaveAttribute('href', `/${region.code}/en/${EVENTS_ROUTE}`)
    expect(getAllByText(arabicName)[0]?.closest('a')).toHaveAttribute('href', `/${region.code}/ar/${EVENTS_ROUTE}`)
    expect(getAllByText('Español')[0]?.closest('a')).toHaveAttribute('href', `/${region.code}/es/${EVENTS_ROUTE}`)
    expect(getAllByText('Deutsch')[1]?.closest('a')).toHaveAttribute('href', eventsPathname)
  })

  it('should link only to languages with available translations', () => {
    mockUseQueryFromEndpointWithData(events)
    const event = events[0]!
    const { getAllByText, getByRole } = renderDetail(event.path)
    fireEvent.click(getByRole('button', { name: 'layout:changeLanguage' }))

    expect(getAllByText('English')[0]?.closest('a')).toHaveAttribute('href', event.availableLanguages.en!)
    expect(getAllByText(arabicName)[0]?.closest('a')).toHaveAttribute('href', event.availableLanguages.ar!)
    expect(getAllByText('Español')[0]?.closest('a')).toBeNull()
    expect(getAllByText('Deutsch')[1]?.closest('a')).toHaveAttribute('href', event.path)
  })
})
