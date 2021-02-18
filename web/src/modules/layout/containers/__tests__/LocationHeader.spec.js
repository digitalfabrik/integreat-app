// @flow

import { render } from '@testing-library/react'
import React from 'react'
import { CityModel } from 'api-client'
import { LocationHeader } from '../LocationHeader'
import { CATEGORIES_ROUTE } from '../../../app/route-configs/CategoriesRouteConfig'
import { EVENTS_ROUTE } from '../../../app/route-configs/EventsRouteConfig'
import { OFFERS_ROUTE } from '../../../app/route-configs/OffersRouteConfig'
import { SPRUNGBRETT_ROUTE } from '../../../app/route-configs/SprungbrettRouteConfig'
import createLocation from '../../../../createLocation'
import { LOCAL_NEWS_ROUTE } from '../../../app/route-configs/LocalNewsRouteConfig'
import EventModelBuilder from 'api-client/src/testing/EventModelBuilder'
import theme from '../../../theme/constants/theme'
import { ThemeProvider } from 'styled-components'

jest.mock('react-i18next')
jest.mock('redux-first-router-link', () =>
  ({ children, ...rest }: { children: React$Node, ... }) => <div {...rest}>.parent{children}</div>
)

describe('LocationHeader', () => {
  const t = (key: ?string): string => key || ''

  const cityModel = (
    offersEnabled: boolean,
    eventsEnabled: boolean,
    poisEnabled: boolean,
    tunewsEnabled: boolean,
    pushNotificationsEnabled: boolean
  ) =>
    new CityModel({
      name: 'Stadt Augsburg',
      code: 'augsburg',
      live: true,
      eventsEnabled,
      offersEnabled,
      poisEnabled,
      pushNotificationsEnabled,
      tunewsEnabled,
      sortingName: 'Augsburg',
      prefix: 'Stadt',
      latitude: 48.369696,
      longitude: 10.892578,
      aliases: {
        Konigsbrunn: {
          latitude: 48.267499,
          longitude: 10.889586
        }
      }
    })

  const languageChangePaths = [
    { code: 'de', name: 'Deutsch', path: '/augsburg/de' },
    { code: 'en', name: 'English', path: '/augsburg/en' }
  ]

  const language = 'de'
  const city = 'augsburg'
  const events = new EventModelBuilder('LocationHeader-events', 2, city, language).build()
  const location = route => createLocation({ type: route, payload: { city, language } })
  const onStickyTopChanged = (value: number) => {}

  const expectNavigationItem = (getByText: string => any, shouldExist: boolean, text: string) => {
    if (shouldExist) {
      expect(getByText(text)).toBeTruthy()
    } else {
      expect(() => getByText(text)).toThrow(text)
    }
  }

  const expectNavigationItems = (
    getByText: string => any,
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
      const { getByText } = render(
        <ThemeProvider theme={theme}>
          <LocationHeader location={location(CATEGORIES_ROUTE)}
                          viewportSmall
                          cityModel={cityModel(false, false, false, false, false)}
                          events={events}
                          languageChangePaths={languageChangePaths}
                          onStickyTopChanged={onStickyTopChanged}
                          t={t} />
        </ThemeProvider>
      )
      expectNavigationItems(getByText, false, false, false, false, false)
    })

    it('should show categories if events are enabled', () => {
      const { getByText } = render(
        <ThemeProvider theme={theme}>
          <LocationHeader location={location(CATEGORIES_ROUTE)}
                          viewportSmall
                          cityModel={cityModel(false, true, false, false, false)}
                          events={events}
                          languageChangePaths={languageChangePaths}
                          onStickyTopChanged={onStickyTopChanged}
                          t={t} />
        </ThemeProvider>
      )
      expectNavigationItems(getByText, true, false, true, false, false)
    })

    it('should show categories if news are enabled', () => {
      const { getByText } = render(
        <ThemeProvider theme={theme}>
          <LocationHeader location={location(CATEGORIES_ROUTE)}
                          viewportSmall
                          cityModel={cityModel(false, false, false, false, true)}
                          events={events}
                          languageChangePaths={languageChangePaths}
                          onStickyTopChanged={onStickyTopChanged}
                          t={t} />
        </ThemeProvider>
      )
      expectNavigationItems(getByText, true, false, false, false, true)
    })

    it('should show categories, news, events, offers, pois', () => {
      const { getByText } = render(
        <ThemeProvider theme={theme}>
          <LocationHeader location={location(CATEGORIES_ROUTE)}
                          viewportSmall
                          cityModel={cityModel(true, true, true, true, true)}
                          events={events}
                          languageChangePaths={languageChangePaths}
                          onStickyTopChanged={onStickyTopChanged}
                          t={t} />
        </ThemeProvider>
      )
      expectNavigationItems(getByText, true, true, true, true, true)
    })

    it('should highlight localInformation if route corresponds', () => {
      const { getByText } = render(
        <ThemeProvider theme={theme}>
          <LocationHeader location={location(CATEGORIES_ROUTE)}
                          viewportSmall
                          cityModel={cityModel(true, false, false, false, false)}
                          events={events}
                          languageChangePaths={languageChangePaths}
                          onStickyTopChanged={onStickyTopChanged}
                          t={t} />
        </ThemeProvider>
      )
      expectNavigationItems(getByText, true, true, true, true, true)
    })

    it('should highlight news if route corresponds', () => {
      const component = shallow(<LocationHeader location={location(LOCAL_NEWS_ROUTE)}
                                                viewportSmall
                                                cityModel={cityModel(true, true, true, true, true)}
                                                events={events}
                                                languageChangePaths={languageChangePaths}
                                                onStickyTopChanged={onStickyTopChanged}
                                                t={t} />)
      const navItem = component.instance().getNavigationItems().find(item => item.props.text === 'news')
      expect(navItem?.props.active).toBe(true)
    })

    it('should highlight events if route corresponds', () => {
      const component = shallow(<LocationHeader location={location(EVENTS_ROUTE)}
                                                viewportSmall
                                                cityModel={cityModel(true, true, true, true, true)}
                                                events={events}
                                                languageChangePaths={languageChangePaths}
                                                onStickyTopChanged={onStickyTopChanged}
                                                t={t} />)
      const navItem = component.instance().getNavigationItems().find(item => item.props.text === 'events')
      expect(navItem?.props.active).toBe(true)
    })

    it('should highlight offers if offers route is active', () => {
      const component = shallow(<LocationHeader location={location(OFFERS_ROUTE)}
                                                viewportSmall
                                                cityModel={cityModel(true, true, true, true, true)}
                                                events={events}
                                                languageChangePaths={languageChangePaths}
                                                onStickyTopChanged={onStickyTopChanged}
                                                t={t} />)
      const navItem = component.instance().getNavigationItems().find(item => item.props.text === 'offers')
      expect(navItem?.props.active).toBe(true)
    })

    it('should highlight offers if sprungbrett route is selected', () => {
      const component = shallow(<LocationHeader location={location(SPRUNGBRETT_ROUTE)}
                                                viewportSmall
                                                cityModel={cityModel(true, true, true, true, true)}
                                                events={events}
                                                languageChangePaths={languageChangePaths}
                                                onStickyTopChanged={onStickyTopChanged}
                                                t={t} />)
      const navItem = component.instance().getNavigationItems().find(item => item.props.text === 'offers')
      expect(navItem?.props.active).toBe(true)
    })
  })
})
