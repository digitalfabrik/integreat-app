// @flow

import React from 'react'
import { render } from '@testing-library/react'
import { CategoriesMapModel, CategoryModel } from 'api-client'
import { LocationLayout } from '../LocationLayout'
import { CATEGORIES_ROUTE } from '../../../app/route-configs/CategoriesRouteConfig'
import moment from 'moment'
import createLocation from '../../../../createLocation'
import { ThemeProvider } from 'styled-components'
import theme from '../../../theme/constants/theme'
import { EVENTS_ROUTE } from '../../../app/route-configs/EventsRouteConfig'
import CityModelBuilder from 'api-client/src/testing/CityModelBuilder'

jest.mock('../../components/LocationFooter', () => {
  return () => <div>LocationFooter</div>
})
jest.mock('../LocationHeader', () => {
  return () => <div>LocationHeader</div>
})
jest.mock('../../components/LocationToolbar', () => {
  return () => <div>LocationToolbar</div>
})
jest.mock('../../../../routes/categories/containers/CategoriesToolbar', () => {
  return () => <div>CategoriesToolbar</div>
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

  const MockNode = () => <div />
  const renderLocationLayout = (location, isLoading) => (
    <LocationLayout
      location={createLocation({ ...location })}
      categories={categories}
      cities={cities}
      languageChangePaths={languageChangePaths}
      feedbackTargetInformation={feedbackTargetInformation}
      viewportSmall
      toggleDarkMode={() => {}}
      darkMode
      isLoading={isLoading}>
      <MockNode />
    </LocationLayout>
  )

  describe('renderToolbar', () => {
    it('should render a CategoriesToolbar if current route is categories', () => {
      const location = {
        payload: { city, language },
        type: CATEGORIES_ROUTE,
        pathname: '/augsburg/de/willkommen'
      }
      const { getByText } = render(<ThemeProvider theme={theme}>{renderLocationLayout(location, false)}</ThemeProvider>)
      expect(getByText('CategoriesToolbar')).toBeTruthy()
    })

    it('should render a LocationToolbar if current route is not categories', () => {
      const location = {
        payload: { city, language },
        type: EVENTS_ROUTE,
        pathname: '/augsburg/de/events'
      }
      const { getByText } = render(<ThemeProvider theme={theme}>{renderLocationLayout(location, false)}</ThemeProvider>)
      expect(getByText('LocationToolbar')).toBeTruthy()
    })
  })

  it('should show LocationHeader and LocationFooter if not loading', () => {
    const location = {
      payload: { city, language },
      type: CATEGORIES_ROUTE,
      pathname: '/augsburg/de/willkommen'
    }
    const { getByText } = render(<ThemeProvider theme={theme}>{renderLocationLayout(location, false)}</ThemeProvider>)
    expect(getByText('LocationHeader')).toBeTruthy()
    expect(getByText('LocationFooter')).toBeTruthy()
  })

  it('should not render LocationFooter if loading', () => {
    const location = {
      payload: { city, language },
      type: CATEGORIES_ROUTE,
      pathname: '/augsburg/de/willkommen'
    }

    const { getByText } = render(<ThemeProvider theme={theme}>{renderLocationLayout(location, true)}</ThemeProvider>)
    expect(getByText('LocationHeader')).toBeTruthy()
    expect(() => getByText('LocationFooter')).toThrow()
  })
})
