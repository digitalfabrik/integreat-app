import React from 'react'
import { render } from '@testing-library/react'
import { CATEGORIES_ROUTE, CategoriesMapModel, CategoryModel, EVENTS_ROUTE } from 'api-client'
import { LocationLayout } from '../LocationLayout'
import moment from 'moment'
import { ThemeProvider } from 'styled-components'
import CityModelBuilder from 'api-client/src/testing/CityModelBuilder'
import buildConfig from '../../constants/buildConfig'
import { Routes } from '../../routes/App'

jest.mock('../LocationFooter', () => {
  return () => <div>LocationFooter</div>
})
jest.mock('../LocationHeader', () => {
  return () => <div>LocationHeader</div>
})
jest.mock('../LocationToolbar', () => {
  return () => <div>LocationToolbar</div>
})

describe('LocationLayout', () => {
  const city = 'augsburg'
  const language = 'de'

  const categories = new CategoriesMapModel([
    new CategoryModel({
      root: true,
      hash: '2fe6283485a93932',
      path: 'path01',
      title: 'Title10',
      content: 'contnentl',
      thumbnail: 'thumb/nail',
      parentPath: 'parent/url',
      order: 4,
      availableLanguages: new Map(),
      lastUpdate: moment('2017-11-18T09:30:00.000Z')
    })
  ])

  const cities = new CityModelBuilder(1).build()

  const languageChangePaths = [
    { code: 'de', name: 'Deutsch', path: '/augsburg/de' },
    { code: 'en', name: 'English', path: '/augsburg/en' }
  ]

  const feedbackTargetInformation = { path: '/path/to/category' }
  const theme = buildConfig().lightTheme

  const MockNode = () => <div />
  const renderLocationLayout = (pathname, routeType, isLoading) => (
    <LocationLayout
      cityCode={city}
      languageCode={language}
      pathname={pathname}
      categories={categories}
      cities={cities}
      routeType={routeType}
      languageChangePaths={languageChangePaths}
      feedbackTargetInformation={feedbackTargetInformation}
      viewportSmall
      isLoading={isLoading}>
      <MockNode />
    </LocationLayout>
  )

  // TODO IGAPP-668: Enable tests
  // eslint-disable-next-line jest/no-disabled-tests
  describe.skip('renderToolbar', () => {
    it('should render a CategoriesToolbar if current route is categories', () => {
      const pathname = '/augsburg/de/willkommen'
      const { getByText } = render(
        <ThemeProvider theme={theme}>{renderLocationLayout(pathname, Routes[CATEGORIES_ROUTE], false)}</ThemeProvider>
      )
      expect(getByText('CategoriesToolbar')).toBeTruthy()
    })

    it('should render a LocationToolbar if current route is not categories', () => {
      const pathname = '/augsburg/de/events'

      const { getByText } = render(
        <ThemeProvider theme={theme}>{renderLocationLayout(pathname, Routes[EVENTS_ROUTE], false)}</ThemeProvider>
      )
      expect(getByText('LocationToolbar')).toBeTruthy()
    })
  })

  it('should show LocationHeader and LocationFooter if not loading', () => {
    const pathname = '/augsburg/de/willkommen'

    const { getByText } = render(
      <ThemeProvider theme={theme}>{renderLocationLayout(pathname, Routes[CATEGORIES_ROUTE], false)}</ThemeProvider>
    )
    expect(getByText('LocationHeader')).toBeTruthy()
    expect(getByText('LocationFooter')).toBeTruthy()
  })

  it('should not render LocationFooter if loading', () => {
    const pathname = '/augsburg/de/willkommen'

    const { getByText } = render(
      <ThemeProvider theme={theme}>{renderLocationLayout(pathname, Routes[CATEGORIES_ROUTE], true)}</ThemeProvider>
    )
    expect(getByText('LocationHeader')).toBeTruthy()
    expect(() => getByText('LocationFooter')).toThrow()
  })
})
