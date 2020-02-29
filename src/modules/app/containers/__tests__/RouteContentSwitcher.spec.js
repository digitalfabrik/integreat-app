// @flow

import RouteContentSwitcher from '../RouteContentSwitcher'
import { CategoriesMapModel, CategoryModel, CityModel, Payload } from '@integreat-app/integreat-api-client'
import moment from 'moment-timezone'
import { mount, shallow } from 'enzyme'
import React from 'react'
import createLocation from '../../../../createLocation'
import { CATEGORIES_ROUTE } from '../../route-configs/CategoriesRouteConfig'
import LoadingSpinner from '../../../common/components/LoadingSpinner'
import theme from '../../../theme/constants/theme'
import { ThemeProvider } from 'styled-components'

describe('RouteContentSwitcher', () => {
  const categories = new CategoriesMapModel([
    new CategoryModel({
      id: 1,
      path: 'path01',
      title: 'Title10',
      content: 'contnentl',
      thumbnail: 'thumb/nail',
      parentPath: 'parent/url',
      order: 4,
      availableLanguages: new Map(),
      lastUpdate: moment.tz('2017-11-18 09:30:00', 'UTC')
    })
  ])

  const cities = [
    new CityModel({
      name: 'Mambo No. 5',
      code: 'city1',
      live: true,
      eventsEnabled: true,
      extrasEnabled: false,
      sortingName: 'Mambo'
    })
  ]

  const categoriesPayload = new Payload(false, 'https://random.api.json', categories, null)
  const citiesPayload = new Payload(false, 'https://random.api.json', cities, null)
  const fetchingPayload = new Payload(true)
  const errorPayload = new Payload(false, 'https://random.api.json', null, new Error('error'))
  const allPayloads = {
    categoriesPayload,
    citiesPayload,
    poisPayload: fetchingPayload,
    eventsPayload: fetchingPayload,
    extrasPayload: fetchingPayload,
    sprungbrettJobsPayload: fetchingPayload,
    wohnenPayload: fetchingPayload,
    disclaimerPayload: fetchingPayload
  }

  const fetchingPayloads = {
    categoriesPayload: fetchingPayload,
    citiesPayload: fetchingPayload,
    poisPayload: fetchingPayload,
    eventsPayload: fetchingPayload,
    extrasPayload: fetchingPayload,
    sprungbrettJobsPayload: fetchingPayload,
    wohnenPayload: fetchingPayload,
    disclaimerPayload: fetchingPayload
  }

  it('should render a FailureSwitcher if a payload contains an error', () => {
    const location = createLocation({ type: CATEGORIES_ROUTE, payload: { city: 'augsburg', language: 'de' } })
    const renderFailureLoadingComponents = shallow(
      <RouteContentSwitcher allPayloads={allPayloads} location={location} />
    ).instance().renderFailureLoadingComponents

    expect(renderFailureLoadingComponents({ payload: errorPayload })).toMatchSnapshot()
  })

  it('should render a Spinner if data has not been fetched yet', () => {
    const location = createLocation({ type: CATEGORIES_ROUTE, payload: { city: 'augsburg', language: 'de' } })

    expect(mount(
        <ThemeProvider theme={theme}>
          <RouteContentSwitcher allPayloads={fetchingPayloads} location={location} />
        </ThemeProvider>
    ).find(LoadingSpinner)).not.toBeUndefined()
  })

  it('should render and match snapshot', () => {
    const location = createLocation({ type: CATEGORIES_ROUTE, payload: { city: 'augsburg', language: 'de' } })

    expect(shallow(<RouteContentSwitcher location={location} allPayloads={allPayloads} />)).toMatchSnapshot()
  })
})
