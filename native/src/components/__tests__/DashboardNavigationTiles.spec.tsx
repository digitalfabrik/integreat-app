import { mocked } from 'jest-mock'
import React from 'react'
import TestRenderer from 'react-test-renderer'

import { CityModel } from 'api-client/src'

import buildConfig from '../../constants/buildConfig'
import TileModel from '../../models/TileModel'
import DashboardNavigationTiles from '../DashboardNavigationTiles'
import NavigationTiles from '../NavigationTiles'

jest.mock('react-i18next')

jest.mock('../../components/NavigationTiles', () => {
  const { Text } = require('react-native')

  return () => <Text>NavigationTiles</Text>
})

describe('DashboardNavigationTiles', () => {
  const language = 'de'
  const navigateTo = jest.fn()

  const createCityModel = (events: boolean, offers: boolean, local: boolean, tunews: boolean, pois: boolean) =>
    new CityModel({
      name: 'Stadt Augsburg',
      code: 'augsburg',
      live: true,
      eventsEnabled: events,
      offersEnabled: offers,
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
      boundingBox: null,
    })

  const mockBuildConfig = (pois: boolean, newsStream: boolean) => {
    const previous = buildConfig()
    mocked(buildConfig).mockImplementation(() => ({
      ...previous,
      featureFlags: { ...previous.featureFlags, pois, newsStream },
    }))
  }

  const renderDashboardNavigationTiles = (cityModel: CityModel): TestRenderer.ReactTestRenderer =>
    TestRenderer.create(
      <DashboardNavigationTiles navigateTo={navigateTo} languageCode={language} cityModel={cityModel} />
    )

  it('should show navigation tiles if there is at least one feature enabled', () => {
    const cityModel = createCityModel(true, false, false, false, false)
    const result = renderDashboardNavigationTiles(cityModel)
    expect(() => result.root.findByType(NavigationTiles)).not.toThrow()
    const navigationTiles = result.root.findByType(NavigationTiles)
    expect(navigationTiles.props.tiles.some((tile: TileModel) => tile.path === 'events')).toBeTruthy()
  })

  it('should not show navigation tiles if there are no features enabled', () => {
    const cityModel = createCityModel(false, false, false, false, false)
    const result = renderDashboardNavigationTiles(cityModel)
    expect(() => result.root.findByType(NavigationTiles)).toThrow()
  })

  it('should show news tile if at least one news feature is enabled', () => {
    mockBuildConfig(false, true)
    const cityModel = createCityModel(false, false, true, false, false)
    const result = renderDashboardNavigationTiles(cityModel)
    const navigationTiles = result.root.findByType(NavigationTiles)
    expect(navigationTiles.props.tiles.some((tile: TileModel) => tile.path === 'news')).toBeTruthy()
    const otherCityModel = createCityModel(false, false, false, true, false)
    const otherResult = renderDashboardNavigationTiles(otherCityModel)
    const otherNavigationTiles = otherResult.root.findByType(NavigationTiles)
    expect(otherNavigationTiles.props.tiles.some((tile: TileModel) => tile.path === 'news')).toBeTruthy()
  })

  it('should show all tiles if all features are enabled in city model and build config', () => {
    mockBuildConfig(true, true)
    const cityModel = createCityModel(true, true, true, true, true)
    const result = renderDashboardNavigationTiles(cityModel)
    expect(() => result.root.findByType(NavigationTiles)).not.toThrow()
    const navigationTiles = result.root.findByType(NavigationTiles)
    expect(navigationTiles.props.tiles).toHaveLength(4)
  })

  it('should not show any feature disabled in the build config', () => {
    mockBuildConfig(false, false)
    const cityModel = createCityModel(true, true, true, true, true)
    const result = renderDashboardNavigationTiles(cityModel)
    expect(() => result.root.findByType(NavigationTiles)).not.toThrow()
    const navigationTiles = result.root.findByType(NavigationTiles)
    expect(navigationTiles.props.tiles).toHaveLength(2)
    expect(navigationTiles.props.tiles.some((tile: TileModel) => tile.path === 'news')).toBeFalsy()
    expect(navigationTiles.props.tiles.some((tile: TileModel) => tile.path === 'pois')).toBeFalsy()
  })
})
