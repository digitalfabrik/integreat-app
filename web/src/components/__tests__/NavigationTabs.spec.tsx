import { Matcher, SelectorMatcherOptions } from '@testing-library/react'
import React from 'react'

import { CityModel, LanguageModelBuilder } from 'shared/api'

import { renderAllRoutes, renderWithRouterAndTheme } from '../../testing/render'
import NavigationTabs from '../NavigationTabs'

jest.mock('react-i18next')

describe('NavigationTabs', () => {
  const cityModel = (eventsEnabled: boolean, poisEnabled: boolean, tunewsEnabled: boolean, localNewsEnabled: boolean) =>
    new CityModel({
      name: 'Stadt Augsburg',
      code: 'augsburg',
      live: true,
      languages: new LanguageModelBuilder(2).build(),
      eventsEnabled,
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
      chatEnabled: false,
      chatPrivacyPolicyUrl: null,
    })

  const languageCode = 'de'

  type GetByTextType = (text: Matcher, options?: SelectorMatcherOptions) => HTMLElement
  const expectNavigationTab = (getByText: GetByTextType, shouldExist: boolean, text: string) => {
    if (shouldExist) {
      expect(getByText(text, { exact: false })).toBeTruthy()
    } else {
      expect(() => getByText(text, { exact: false })).toThrow(text)
    }
  }

  const expectNavigationTabs = (
    getByText: GetByTextType,
    categories: boolean,
    events: boolean,
    pois: boolean,
    news: boolean,
  ) => {
    expectNavigationTab(getByText, categories, 'localInformation')
    expectNavigationTab(getByText, events, 'events')
    expectNavigationTab(getByText, pois, 'locations')
    expectNavigationTab(getByText, news, 'news')
  }

  it('should be empty if all other header items are disabled', () => {
    const { getByText } = renderWithRouterAndTheme(
      <NavigationTabs languageCode={languageCode} cityModel={cityModel(false, false, false, false)} />,
    )
    expectNavigationTabs(getByText, false, false, false, false)
  })

  it('should show categories if events are enabled', () => {
    const { getByText } = renderWithRouterAndTheme(
      <NavigationTabs languageCode={languageCode} cityModel={cityModel(true, false, false, false)} />,
    )
    expectNavigationTabs(getByText, true, true, false, false)
  })

  it('should show categories if news are enabled', () => {
    const { getByText } = renderWithRouterAndTheme(
      <NavigationTabs languageCode={languageCode} cityModel={cityModel(false, false, false, true)} />,
    )
    expectNavigationTabs(getByText, true, false, false, true)
  })

  it('should show categories, news, events, pois', () => {
    const { getByText } = renderWithRouterAndTheme(
      <NavigationTabs languageCode={languageCode} cityModel={cityModel(true, true, true, true)} />,
    )
    expectNavigationTabs(getByText, true, true, true, true)
  })

  it('should highlight local information tab', () => {
    const { getByRole } = renderAllRoutes('/augsburg/de', {
      CityContentElement: <NavigationTabs languageCode={languageCode} cityModel={cityModel(true, true, true, true)} />,
    })
    expect(getByRole('tab', { selected: true })).toHaveTextContent('layout:localInformation')
  })

  it('should highlight local information tab for nested categories', () => {
    const { getByRole } = renderAllRoutes('/augsburg/de/willkommen/hallo', {
      CityContentElement: <NavigationTabs languageCode={languageCode} cityModel={cityModel(true, true, true, true)} />,
    })
    expect(getByRole('tab', { selected: true })).toHaveTextContent('layout:localInformation')
  })

  it('should highlight news tab', () => {
    const { getByRole } = renderAllRoutes('/augsburg/de/news/local', {
      CityContentElement: <NavigationTabs languageCode={languageCode} cityModel={cityModel(true, true, true, true)} />,
    })
    expect(getByRole('tab', { selected: true })).toHaveTextContent('layout:news')
  })

  it('should highlight events tab', () => {
    const { getByRole } = renderAllRoutes('/augsburg/de/events', {
      CityContentElement: <NavigationTabs languageCode={languageCode} cityModel={cityModel(true, true, true, true)} />,
    })
    expect(getByRole('tab', { selected: true })).toHaveTextContent('layout:events')
  })

  it('should highlight pois tab', () => {
    const { getByRole } = renderAllRoutes('/augsburg/de/locations', {
      CityContentElement: <NavigationTabs languageCode={languageCode} cityModel={cityModel(true, true, true, true)} />,
    })
    expect(getByRole('tab', { selected: true })).toHaveTextContent('layout:locations')
  })

  it('should not highlight any tab for other route', () => {
    const { queryByRole } = renderAllRoutes('/augsburg/de/search', {
      CityContentElement: <NavigationTabs languageCode={languageCode} cityModel={cityModel(true, true, true, true)} />,
    })
    expect(queryByRole('tab', { selected: true })).toBeNull()
  })
})
