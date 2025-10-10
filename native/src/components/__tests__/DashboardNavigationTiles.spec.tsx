import { mocked } from 'jest-mock'
import React from 'react'
import mockSafeAreaContext from 'react-native-safe-area-context/jest/mock'

import { CityModel, LanguageModelBuilder } from 'shared/api'

import buildConfig from '../../constants/buildConfig'
import render from '../../testing/render'
import DashboardNavigationTiles from '../DashboardNavigationTiles'

jest.mock('react-i18next')
jest.mock('react-native-safe-area-context', () => mockSafeAreaContext)
jest.mock('../../constants/buildConfig', () => {
  const actualImplementation = jest.requireActual('../../constants/buildConfig')
  return {
    ...actualImplementation,
    __esModule: true,
    default: jest.fn(actualImplementation.default),
  }
})

describe('DashboardNavigationTiles', () => {
  const language = 'de'
  const navigateTo = jest.fn()

  const createCityModel = (events: boolean, local: boolean, tunews: boolean, pois: boolean) =>
    new CityModel({
      name: 'Stadt Augsburg',
      code: 'augsburg',
      live: true,
      languages: new LanguageModelBuilder(2).build(),
      eventsEnabled: events,
      localNewsEnabled: local,
      tunewsEnabled: tunews,
      poisEnabled: pois,
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

  const mockBuildConfig = (pois: boolean, newsStream: boolean) => {
    const previous = buildConfig()
    mocked(buildConfig).mockImplementation(() => ({
      ...previous,
      featureFlags: { ...previous.featureFlags, pois, newsStream },
    }))
  }

  const renderDashboardNavigationTiles = (cityModel: CityModel) =>
    render(<DashboardNavigationTiles navigateTo={navigateTo} languageCode={language} cityModel={cityModel} />)

  it('should show navigation tiles if there is at least one feature enabled', () => {
    const cityModel = createCityModel(true, false, false, false)
    const { getByText } = renderDashboardNavigationTiles(cityModel)
    expect(getByText('events')).toBeTruthy()
  })

  it('should not show navigation tiles if there are no features enabled', () => {
    const cityModel = createCityModel(false, false, false, false)
    const { queryByText } = renderDashboardNavigationTiles(cityModel)
    expect(queryByText('locations')).toBeNull()
    expect(queryByText('news')).toBeNull()
    expect(queryByText('events')).toBeNull()
  })

  it('should show news tile if at least one news feature is enabled', () => {
    mockBuildConfig(false, true)
    const cityModel = createCityModel(false, true, false, false)
    const { getByText } = renderDashboardNavigationTiles(cityModel)
    expect(getByText('news')).toBeTruthy()
  })

  it('should show all tiles if all features are enabled in city model and build config', () => {
    mockBuildConfig(true, true)
    const cityModel = createCityModel(true, true, true, true)
    const { getByText } = renderDashboardNavigationTiles(cityModel)

    expect(getByText('locations')).toBeTruthy()
    expect(getByText('news')).toBeTruthy()
    expect(getByText('events')).toBeTruthy()
  })

  it('should not show any feature disabled in the build config', () => {
    mockBuildConfig(false, false)
    const cityModel = createCityModel(true, true, true, true)
    const { queryByText } = renderDashboardNavigationTiles(cityModel)

    expect(queryByText('events')).toBeTruthy()
    expect(queryByText('locations')).toBeFalsy()
    expect(queryByText('news')).toBeFalsy()
  })
})
