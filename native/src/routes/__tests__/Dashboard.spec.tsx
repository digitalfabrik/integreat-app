import { mocked } from 'jest-mock'
import * as React from 'react'
import TestRenderer from 'react-test-renderer'
import { ThemeProvider } from 'styled-components'

import { CityModel } from 'api-client'
import CategoriesMapModelBuilder from 'api-client/src/testing/CategoriesMapModelBuilder'

import NavigationTiles from '../../components/NavigationTiles'
import buildConfig from '../../constants/buildConfig'
import CategoriesRouteStateView from '../../models/CategoriesRouteStateView'
import TileModel from '../../models/TileModel'
import Dashboard from '../Dashboard'

jest.mock('react-i18next')
jest.mock('../../components/Page', () => {
  const { Text } = require('react-native')

  return () => <Text>Page</Text>
})
jest.mock('../../components/NavigationTiles', () => {
  const { Text } = require('react-native')

  return () => <Text>NavigationTiles</Text>
})

describe('Dashboard', () => {
  const categoriesMapModel = new CategoriesMapModelBuilder('augsburg', 'de').build()
  const categoryLeaf = categoriesMapModel.toArray().find(category => categoriesMapModel.isLeaf(category))
  const language = 'de'
  const navigateTo = jest.fn()
  const navigateToFeedback = jest.fn()
  const theme = buildConfig().lightTheme

  if (!categoryLeaf) {
    throw Error('There should be a leaf!')
  }

  const stateView = new CategoriesRouteStateView(
    categoryLeaf.path,
    {
      [categoryLeaf.path]: categoryLeaf
    },
    {
      [categoryLeaf.path]: []
    }
  )
  const resourceCache = {}
  const resourceCacheUrl = 'https://localhost:8080'

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
          longitude: 10.889586
        }
      },
      boundingBox: [5.98865807458, 47.3024876979, 15.0169958839, 54.983104153]
    })

  const mockBuildConfig = (pois: boolean, newsStream: boolean) => {
    const previous = buildConfig()
    mocked(buildConfig).mockImplementation(() => ({
      ...previous,
      featureFlags: { ...previous.featureFlags, pois, newsStream }
    }))
  }

  const renderDashboard = (cityModel: CityModel): TestRenderer.ReactTestRenderer =>
    TestRenderer.create(
      <ThemeProvider theme={theme}>
        <Dashboard
          navigateToFeedback={navigateToFeedback}
          navigateTo={navigateTo}
          language={language}
          cityModel={cityModel}
          stateView={stateView}
          resourceCache={resourceCache}
          resourceCacheUrl={resourceCacheUrl}
        />
      </ThemeProvider>
    )

  it('should show navigation tiles if there are is at least one feature enabled', () => {
    const cityModel = createCityModel(true, false, false, false, false)
    const result = renderDashboard(cityModel)
    expect(() => result.root.findByType(NavigationTiles)).not.toThrow()
    const navigationTiles = result.root.findByType(NavigationTiles)
    expect(navigationTiles.props.tiles.some((tile: TileModel) => tile.path === 'events')).toBeTruthy()
  })

  it('should not show navigation tiles if there are no features enabled', () => {
    const cityModel = createCityModel(false, false, false, false, false)
    const result = renderDashboard(cityModel)
    expect(() => result.root.findByType(NavigationTiles)).toThrow()
  })

  it('should show news tile if at least one news feature is enabled', () => {
    mockBuildConfig(false, true)
    const cityModel = createCityModel(false, false, true, false, false)
    const result = renderDashboard(cityModel)
    const navigationTiles = result.root.findByType(NavigationTiles)
    expect(navigationTiles.props.tiles.some((tile: TileModel) => tile.path === 'news')).toBeTruthy()
    const otherCityModel = createCityModel(false, false, false, true, false)
    const otherResult = renderDashboard(otherCityModel)
    const otherNavigationTiles = otherResult.root.findByType(NavigationTiles)
    expect(otherNavigationTiles.props.tiles.some((tile: TileModel) => tile.path === 'news')).toBeTruthy()
  })

  it('should show all tiles if all features are enabled in city model and build config', () => {
    mockBuildConfig(true, true)
    const cityModel = createCityModel(true, true, true, true, true)
    const result = renderDashboard(cityModel)
    expect(() => result.root.findByType(NavigationTiles)).not.toThrow()
    const navigationTiles = result.root.findByType(NavigationTiles)
    expect(navigationTiles.props.tiles).toHaveLength(4)
  })

  it('should show any feature disabled in the build config', () => {
    mockBuildConfig(false, false)
    const cityModel = createCityModel(true, true, true, true, true)
    const result = renderDashboard(cityModel)
    expect(() => result.root.findByType(NavigationTiles)).not.toThrow()
    const navigationTiles = result.root.findByType(NavigationTiles)
    expect(navigationTiles.props.tiles).toHaveLength(2)
    expect(navigationTiles.props.tiles.some((tile: TileModel) => tile.path === 'news')).toBeFalsy()
    expect(navigationTiles.props.tiles.some((tile: TileModel) => tile.path === 'pois')).toBeFalsy()
  })
})
