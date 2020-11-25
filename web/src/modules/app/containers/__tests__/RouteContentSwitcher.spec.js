// @flow

import RouteContentSwitcher from '../RouteContentSwitcher'
import { CategoriesMapModel, CategoryModel, CityModel, Payload } from 'api-client'
import moment from 'moment'
import { render } from '@testing-library/react'
import { shallow } from 'enzyme'
import React from 'react'
import createLocation from '../../../../createLocation'
import { CATEGORIES_ROUTE } from '../../route-configs/CategoriesRouteConfig'
import theme from '../../../theme/constants/theme'
import { ThemeProvider } from 'styled-components'

jest.mock('../../../common/components/FailureSwitcher', () => {
  return () => <div>FailureSwitcher</div>
})
jest.mock('../../../common/components/LoadingSpinner', () => {
  return () => <div>LoadingSpinner</div>
})

describe('RouteContentSwitcher', () => {
  const categories = new CategoriesMapModel([
    new CategoryModel({
      root: true,
      path: 'path01',
      title: 'Title10',
      content: 'contnentl',
      thumbnail: 'thumb/nail',
      parentPath: 'parent/url',
      order: 4,
      availableLanguages: new Map(),
      lastUpdate: moment('2017-11-18T09:30:00.000Z'),
      hash: '2fe6283485a93932'
    })
  ])

  const cities = [
    new CityModel({
      name: 'Mambo No. 5',
      code: 'city1',
      live: true,
      eventsEnabled: true,
      offersEnabled: false,
      pushNotificationsEnabled: false,
      tunewsEnabled: false,
      sortingName: 'Mambo',
      aliases: null,
      longitude: null,
      latitude: null,
      prefix: null
    })
  ]

  const categoriesPayload = new Payload(false, 'https://random.api.json', categories, null)
  const citiesPayload = new Payload(false, 'https://random.api.json', cities, null)
  const errorPayload = new Payload(false, 'https://random.api.json', null, new Error('error'))
  const payloads = {
    categories: categoriesPayload,
    cities: citiesPayload
  }

  it('should render a FailureSwitcher if a payload contains an error', () => {
    const location = createLocation({ type: CATEGORIES_ROUTE, payload: { city: 'augsburg', language: 'de' } })
    const { getByText } = render(
      <ThemeProvider theme={theme}>
        <RouteContentSwitcher payloads={{ payload: errorPayload }} isLoading={false} location={location} />
      </ThemeProvider>
    )

    expect(getByText('FailureSwitcher')).toBeTruthy()
  })

  it('should render a Spinner if data has not been fetched yet', () => {
    const location = createLocation({ type: CATEGORIES_ROUTE, payload: { city: 'augsburg', language: 'de' } })

    const { getByText } = render(
      <ThemeProvider theme={theme}>
        <RouteContentSwitcher payloads={payloads} isLoading location={location} />
      </ThemeProvider>
    )

    expect(getByText('LoadingSpinner')).toBeTruthy()
  })

  it('should render and match snapshot', () => {
    const location = createLocation({ type: CATEGORIES_ROUTE, payload: { city: 'augsburg', language: 'de' } })

    expect(shallow(
      <RouteContentSwitcher location={location} payloads={payloads} isLoading={false} />)
    ).toMatchSnapshot()
  })
})
