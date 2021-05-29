import { render, Matcher, SelectorMatcherOptions } from '@testing-library/react'
import React from 'react'
import { CityModel } from 'api-client'
import { LocationHeader } from '../LocationHeader'
import { ThemeProvider } from 'styled-components'
import buildConfig from '../../constants/buildConfig'

jest.mock('react-i18next')
jest.mock('redux-first-router-link')
jest.mock('../../components/HeaderNavigationItem', () => ({ text, active }: { text: string, active: boolean }) => (
  <div>{`${text} ${active ? 'active' : 'inactive'}`}</div>
))

describe('LocationHeader', () => {
  const t = key => key
  const theme = buildConfig().lightTheme

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

  const languageCode = 'de'
  const cityCode = 'augsburg'
  const pathname = '/augsburg/de/willkommen'
  const onStickyTopChanged = (value: number) => {}

  type GetByTextType = (text: Matcher, options?: SelectorMatcherOptions | undefined) => HTMLElement
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
      const { getByText } = render(
        <ThemeProvider theme={theme}>
          <LocationHeader
            languageCode={languageCode}
            pathname={pathname}
            viewportSmall
            cityModel={cityModel(false, false, false, false, false)}
            languageChangePaths={languageChangePaths}
            onStickyTopChanged={onStickyTopChanged}
            t={t}
          />
        </ThemeProvider>
      )
      expectNavigationItems(getByText, false, false, false, false, false)
    })

    it('should show categories if events are enabled', () => {
      const { getByText } = render(
        <ThemeProvider theme={theme}>
          <LocationHeader
            languageCode={languageCode}
            pathname={pathname}
            viewportSmall
            cityModel={cityModel(false, true, false, false, false)}
            languageChangePaths={languageChangePaths}
            onStickyTopChanged={onStickyTopChanged}
            t={t}
          />
        </ThemeProvider>
      )
      expectNavigationItems(getByText, true, false, true, false, false)
    })

    it('should show categories if news are enabled', () => {
      const { getByText } = render(
        <ThemeProvider theme={theme}>
          <LocationHeader
            languageCode={languageCode}
            pathname={pathname}
            viewportSmall
            cityModel={cityModel(false, false, false, false, true)}
            languageChangePaths={languageChangePaths}
            onStickyTopChanged={onStickyTopChanged}
            t={t}
          />
        </ThemeProvider>
      )
      expectNavigationItems(getByText, true, false, false, false, true)
    })

    it('should show categories, news, events, offers, pois', () => {
      const { getByText } = render(
        <ThemeProvider theme={theme}>
          <LocationHeader
            languageCode={languageCode}
            pathname={pathname}
            viewportSmall
            cityModel={cityModel(true, true, true, true, true)}
            languageChangePaths={languageChangePaths}
            onStickyTopChanged={onStickyTopChanged}
            t={t}
          />
        </ThemeProvider>
      )
      expectNavigationItems(getByText, true, true, true, true, true)
    })

    it('should highlight local information if route corresponds', () => {
      const { getByText } = render(
        <ThemeProvider theme={theme}>
          <LocationHeader
            languageCode={languageCode}
            pathname={pathname}
            viewportSmall
            cityModel={cityModel(true, true, true, true, true)}
            languageChangePaths={languageChangePaths}
            onStickyTopChanged={onStickyTopChanged}
            t={t}
          />
        </ThemeProvider>
      )
      expect(getByText('localInformation active')).toBeTruthy()
      expect(getByText('offers inactive')).toBeTruthy()
      expect(getByText('news inactive')).toBeTruthy()
      expect(getByText('events inactive')).toBeTruthy()
      expect(getByText('pois inactive')).toBeTruthy()
    })

    it('should highlight news if the local news route is selected', () => {
      const { getByText } = render(
        <ThemeProvider theme={theme}>
          <LocationHeader
            languageCode={languageCode}
            pathname={pathname}
            viewportSmall
            cityModel={cityModel(true, true, true, true, true)}
            languageChangePaths={languageChangePaths}
            onStickyTopChanged={onStickyTopChanged}
            t={t}
          />
        </ThemeProvider>
      )
      expect(getByText('localInformation inactive')).toBeTruthy()
      expect(getByText('offers inactive')).toBeTruthy()
      expect(getByText('news active')).toBeTruthy()
      expect(getByText('events inactive')).toBeTruthy()
      expect(getByText('pois inactive')).toBeTruthy()
    })

    it('should highlight news if the local news detail route is selected', () => {
      const { getByText } = render(
        <ThemeProvider theme={theme}>
          <LocationHeader
            languageCode={languageCode}
            pathname={pathname}
            viewportSmall
            cityModel={cityModel(true, true, true, true, true)}
            languageChangePaths={languageChangePaths}
            onStickyTopChanged={onStickyTopChanged}
            t={t}
          />
        </ThemeProvider>
      )
      expect(getByText('localInformation inactive')).toBeTruthy()
      expect(getByText('offers inactive')).toBeTruthy()
      expect(getByText('news active')).toBeTruthy()
      expect(getByText('events inactive')).toBeTruthy()
      expect(getByText('pois inactive')).toBeTruthy()
    })
    it('should highlight news if the tu news route is selected', () => {
      const { getByText } = render(
        <ThemeProvider theme={theme}>
          <LocationHeader
            languageCode={languageCode}
            pathname={pathname}
            viewportSmall
            cityModel={cityModel(true, true, true, true, true)}
            languageChangePaths={languageChangePaths}
            onStickyTopChanged={onStickyTopChanged}
            t={t}
          />
        </ThemeProvider>
      )
      expect(getByText('localInformation inactive')).toBeTruthy()
      expect(getByText('offers inactive')).toBeTruthy()
      expect(getByText('news active')).toBeTruthy()
      expect(getByText('events inactive')).toBeTruthy()
      expect(getByText('pois inactive')).toBeTruthy()
    })

    it('should highlight news if the tu news detail route is selected', () => {
      const { getByText } = render(
        <ThemeProvider theme={theme}>
          <LocationHeader
            languageCode={languageCode}
            pathname={pathname}
            viewportSmall
            cityModel={cityModel(true, true, true, true, true)}
            languageChangePaths={languageChangePaths}
            onStickyTopChanged={onStickyTopChanged}
            t={t}
          />
        </ThemeProvider>
      )
      expect(getByText('localInformation inactive')).toBeTruthy()
      expect(getByText('offers inactive')).toBeTruthy()
      expect(getByText('news active')).toBeTruthy()
      expect(getByText('events inactive')).toBeTruthy()
      expect(getByText('pois inactive')).toBeTruthy()
    })

    it('should highlight events if route corresponds', () => {
      const { getByText } = render(
        <ThemeProvider theme={theme}>
          <LocationHeader
            languageCode={languageCode}
            pathname={pathname}
            viewportSmall
            cityModel={cityModel(true, true, true, true, true)}
            languageChangePaths={languageChangePaths}
            onStickyTopChanged={onStickyTopChanged}
            t={t}
          />
        </ThemeProvider>
      )
      expect(getByText('localInformation inactive')).toBeTruthy()
      expect(getByText('offers inactive')).toBeTruthy()
      expect(getByText('news inactive')).toBeTruthy()
      expect(getByText('events active')).toBeTruthy()
      expect(getByText('pois inactive')).toBeTruthy()
    })

    it('should highlight offers if offers route is active', () => {
      const { getByText } = render(
        <ThemeProvider theme={theme}>
          <LocationHeader
            languageCode={languageCode}
            pathname={pathname}
            viewportSmall
            cityModel={cityModel(true, true, true, true, true)}
            languageChangePaths={languageChangePaths}
            onStickyTopChanged={onStickyTopChanged}
            t={t}
          />
        </ThemeProvider>
      )
      expect(getByText('localInformation inactive')).toBeTruthy()
      expect(getByText('offers active')).toBeTruthy()
      expect(getByText('news inactive')).toBeTruthy()
      expect(getByText('events inactive')).toBeTruthy()
      expect(getByText('pois inactive')).toBeTruthy()
    })

    it('should highlight offers if sprungbrett route is selected', () => {
      const { getByText } = render(
        <ThemeProvider theme={theme}>
          <LocationHeader
            languageCode={languageCode}
            pathname={pathname}
            viewportSmall
            cityModel={cityModel(true, true, true, true, true)}
            languageChangePaths={languageChangePaths}
            onStickyTopChanged={onStickyTopChanged}
            t={t}
          />
        </ThemeProvider>
      )
      expect(getByText('localInformation inactive')).toBeTruthy()
      expect(getByText('offers active')).toBeTruthy()
      expect(getByText('news inactive')).toBeTruthy()
      expect(getByText('events inactive')).toBeTruthy()
      expect(getByText('pois inactive')).toBeTruthy()
    })

    it('should highlight pois if pois route is selected', () => {
      const { getByText } = render(
        <ThemeProvider theme={theme}>
          <LocationHeader
            languageCode={languageCode}
            pathname={pathname}
            viewportSmall
            cityModel={cityModel(true, true, true, true, true)}
            languageChangePaths={languageChangePaths}
            onStickyTopChanged={onStickyTopChanged}
            t={t}
          />
        </ThemeProvider>
      )
      expect(getByText('localInformation inactive')).toBeTruthy()
      expect(getByText('offers inactive')).toBeTruthy()
      expect(getByText('news inactive')).toBeTruthy()
      expect(getByText('events inactive')).toBeTruthy()
      expect(getByText('pois active')).toBeTruthy()
    })
  })
})
