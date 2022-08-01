import { Matcher, SelectorMatcherOptions } from '@testing-library/react'
import React from 'react'
import { ThemeProvider } from 'styled-components'

import {
  CATEGORIES_ROUTE,
  CityModel,
  EVENTS_ROUTE,
  OFFERS_ROUTE,
  POIS_ROUTE,
  SPRUNGBRETT_OFFER_ROUTE,
} from 'api-client'

import buildConfig from '../../constants/buildConfig'
import { LOCAL_NEWS_ROUTE, TU_NEWS_DETAIL_ROUTE, TU_NEWS_ROUTE } from '../../routes'
import { renderWithRouter } from '../../testing/render'
import LocationHeader from '../LocationHeader'

jest.mock('react-i18next')
jest.mock('../HeaderNavigationItem', () => ({ text, active }: { text: string; active: boolean }) => (
  <div>{`${text} ${active ? 'active' : 'inactive'}`}</div>
))

describe('LocationHeader', () => {
  const theme = buildConfig().lightTheme

  const cityModel = (
    offersEnabled: boolean,
    eventsEnabled: boolean,
    poisEnabled: boolean,
    tunewsEnabled: boolean,
    localNewsEnabled: boolean
  ) =>
    new CityModel({
      name: 'Stadt Augsburg',
      code: 'augsburg',
      live: true,
      eventsEnabled,
      offersEnabled,
      poisEnabled,
      localNewsEnabled,
      tunewsEnabled,
      sortingName: 'Augsburg',
      prefix: 'Stadt',
      latitude: 48.369696,
      longitude: 10.892578,
      aliases: {
        Konigsbrunn: {
          latitude: 48.267499,
          longitude: 10.889586,
        },
      },
      boundingBox: [10.7880103, 48.447238, 11.0174493, 48.297834],
    })

  const languageChangePaths = [
    { code: 'de', name: 'Deutsch', path: '/augsburg/de' },
    { code: 'en', name: 'English', path: '/augsburg/en' },
  ]

  const languageCode = 'de'

  type GetByTextType = (text: Matcher, options?: SelectorMatcherOptions) => HTMLElement
  const expectNavigationItem = (getByText: GetByTextType, shouldExist: boolean, text: string) => {
    if (shouldExist) {
      expect(getByText(text, { exact: false })).toBeTruthy()
    } else {
      expect(() => getByText(text, { exact: false })).toThrow(text)
    }
  }

  const expectNavigationItems = (
    getByText: GetByTextType,
    categories: boolean,
    offers: boolean,
    events: boolean,
    pois: boolean,
    news: boolean
  ) => {
    expectNavigationItem(getByText, categories, 'localInformation')
    expectNavigationItem(getByText, offers, 'offers')
    expectNavigationItem(getByText, events, 'events')
    expectNavigationItem(getByText, pois, 'pois')
    expectNavigationItem(getByText, news, 'news')
  }

  describe('NavigationItems', () => {
    it('should be empty if all other header items are disabled', () => {
      const { getByText } = renderWithRouter(
        <ThemeProvider theme={theme}>
          <LocationHeader
            languageCode={languageCode}
            route={CATEGORIES_ROUTE}
            viewportSmall
            cityModel={cityModel(false, false, false, false, false)}
            languageChangePaths={languageChangePaths}
          />
        </ThemeProvider>
      )
      expectNavigationItems(getByText, false, false, false, false, false)
    })

    it('should show categories if events are enabled', () => {
      const { getByText } = renderWithRouter(
        <ThemeProvider theme={theme}>
          <LocationHeader
            languageCode={languageCode}
            route={CATEGORIES_ROUTE}
            viewportSmall
            cityModel={cityModel(false, true, false, false, false)}
            languageChangePaths={languageChangePaths}
          />
        </ThemeProvider>
      )
      expectNavigationItems(getByText, true, false, true, false, false)
    })

    it('should show categories if news are enabled', () => {
      const { getByText } = renderWithRouter(
        <ThemeProvider theme={theme}>
          <LocationHeader
            languageCode={languageCode}
            route={CATEGORIES_ROUTE}
            viewportSmall
            cityModel={cityModel(false, false, false, false, true)}
            languageChangePaths={languageChangePaths}
          />
        </ThemeProvider>
      )
      expectNavigationItems(getByText, true, false, false, false, true)
    })

    it('should show categories, news, events, offers, pois', () => {
      const { getByText } = renderWithRouter(
        <ThemeProvider theme={theme}>
          <LocationHeader
            languageCode={languageCode}
            route={CATEGORIES_ROUTE}
            viewportSmall
            cityModel={cityModel(true, true, true, true, true)}
            languageChangePaths={languageChangePaths}
          />
        </ThemeProvider>
      )
      expectNavigationItems(getByText, true, true, true, true, true)
    })

    it('should highlight local information if route corresponds', () => {
      const { getByText } = renderWithRouter(
        <ThemeProvider theme={theme}>
          <LocationHeader
            languageCode={languageCode}
            route={CATEGORIES_ROUTE}
            viewportSmall
            cityModel={cityModel(true, true, true, true, true)}
            languageChangePaths={languageChangePaths}
          />
        </ThemeProvider>
      )
      expect(getByText('layout:localInformation active')).toBeTruthy()
      expect(getByText('layout:offers inactive')).toBeTruthy()
      expect(getByText('layout:news inactive')).toBeTruthy()
      expect(getByText('layout:events inactive')).toBeTruthy()
      expect(getByText('layout:pois inactive')).toBeTruthy()
    })

    it('should highlight news if the local news route is selected', () => {
      const { getByText } = renderWithRouter(
        <ThemeProvider theme={theme}>
          <LocationHeader
            languageCode={languageCode}
            route={LOCAL_NEWS_ROUTE}
            viewportSmall
            cityModel={cityModel(true, true, true, true, true)}
            languageChangePaths={languageChangePaths}
          />
        </ThemeProvider>
      )
      expect(getByText('layout:localInformation inactive')).toBeTruthy()
      expect(getByText('layout:offers inactive')).toBeTruthy()
      expect(getByText('layout:news active')).toBeTruthy()
      expect(getByText('layout:events inactive')).toBeTruthy()
      expect(getByText('layout:pois inactive')).toBeTruthy()
    })

    it('should highlight news if the tu news route is selected', () => {
      const { getByText } = renderWithRouter(
        <ThemeProvider theme={theme}>
          <LocationHeader
            languageCode={languageCode}
            route={TU_NEWS_ROUTE}
            viewportSmall
            cityModel={cityModel(true, true, true, true, true)}
            languageChangePaths={languageChangePaths}
          />
        </ThemeProvider>
      )
      expect(getByText('layout:localInformation inactive')).toBeTruthy()
      expect(getByText('layout:offers inactive')).toBeTruthy()
      expect(getByText('layout:news active')).toBeTruthy()
      expect(getByText('layout:events inactive')).toBeTruthy()
      expect(getByText('layout:pois inactive')).toBeTruthy()
    })

    it('should highlight news if the tu news detail route is selected', () => {
      const { getByText } = renderWithRouter(
        <ThemeProvider theme={theme}>
          <LocationHeader
            languageCode={languageCode}
            route={TU_NEWS_DETAIL_ROUTE}
            viewportSmall
            cityModel={cityModel(true, true, true, true, true)}
            languageChangePaths={languageChangePaths}
          />
        </ThemeProvider>
      )
      expect(getByText('layout:localInformation inactive')).toBeTruthy()
      expect(getByText('layout:offers inactive')).toBeTruthy()
      expect(getByText('layout:news active')).toBeTruthy()
      expect(getByText('layout:events inactive')).toBeTruthy()
      expect(getByText('layout:pois inactive')).toBeTruthy()
    })

    it('should highlight events if route corresponds', () => {
      const { getByText } = renderWithRouter(
        <ThemeProvider theme={theme}>
          <LocationHeader
            languageCode={languageCode}
            route={EVENTS_ROUTE}
            viewportSmall
            cityModel={cityModel(true, true, true, true, true)}
            languageChangePaths={languageChangePaths}
          />
        </ThemeProvider>
      )
      expect(getByText('layout:localInformation inactive')).toBeTruthy()
      expect(getByText('layout:offers inactive')).toBeTruthy()
      expect(getByText('layout:news inactive')).toBeTruthy()
      expect(getByText('layout:events active')).toBeTruthy()
      expect(getByText('layout:pois inactive')).toBeTruthy()
    })

    it('layout:should highlight offers if offers route is active', () => {
      const { getByText } = renderWithRouter(
        <ThemeProvider theme={theme}>
          <LocationHeader
            languageCode={languageCode}
            route={OFFERS_ROUTE}
            viewportSmall
            cityModel={cityModel(true, true, true, true, true)}
            languageChangePaths={languageChangePaths}
          />
        </ThemeProvider>
      )
      expect(getByText('layout:localInformation inactive')).toBeTruthy()
      expect(getByText('layout:offers active')).toBeTruthy()
      expect(getByText('layout:news inactive')).toBeTruthy()
      expect(getByText('layout:events inactive')).toBeTruthy()
      expect(getByText('layout:pois inactive')).toBeTruthy()
    })

    it('should highlight offers if sprungbrett route is selected', () => {
      const { getByText } = renderWithRouter(
        <ThemeProvider theme={theme}>
          <LocationHeader
            languageCode={languageCode}
            route={SPRUNGBRETT_OFFER_ROUTE}
            viewportSmall
            cityModel={cityModel(true, true, true, true, true)}
            languageChangePaths={languageChangePaths}
          />
        </ThemeProvider>
      )
      expect(getByText('layout:localInformation inactive')).toBeTruthy()
      expect(getByText('layout:offers active')).toBeTruthy()
      expect(getByText('layout:news inactive')).toBeTruthy()
      expect(getByText('layout:events inactive')).toBeTruthy()
      expect(getByText('layout:pois inactive')).toBeTruthy()
    })

    it('should highlight pois if pois route is selected', () => {
      const { getByText } = renderWithRouter(
        <ThemeProvider theme={theme}>
          <LocationHeader
            languageCode={languageCode}
            route={POIS_ROUTE}
            viewportSmall
            cityModel={cityModel(true, true, true, true, true)}
            languageChangePaths={languageChangePaths}
          />
        </ThemeProvider>
      )
      expect(getByText('layout:localInformation inactive')).toBeTruthy()
      expect(getByText('layout:offers inactive')).toBeTruthy()
      expect(getByText('layout:news inactive')).toBeTruthy()
      expect(getByText('layout:events inactive')).toBeTruthy()
      expect(getByText('layout:pois active')).toBeTruthy()
    })
  })
})
