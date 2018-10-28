// @flow

import React from 'react'
import PoiModel from '../../../../modules/endpoint/models/PoiModel'
import LocationModel from '../../../../modules/endpoint/models/LocationModel'
import moment from 'moment-timezone'
import ConnectedPoiPage, { PoiPage } from '../PoiPage'
import CityModel from '../../../../modules/endpoint/models/CityModel'
import { shallow } from 'enzyme'

describe('PoiPage', () => {
  const pois = [
    new PoiModel({
      id: 1,
      path: '/augsburg/en/locations/first_poi',
      title: 'first Event',
      availableLanguages: new Map(
        [['de', '/augsburg/de/locations/erster_poi'], ['ar', '/augsburg/ar/locations/erster_poi']]),
      location: new LocationModel({
        address: 'address',
        town: 'town',
        postcode: 'postcode'
      }),
      excerpt: 'excerpt',
      lastUpdate: moment('2016-01-07 10:36:24'),
      content: 'content',
      thumbnail: 'thumbnail'
    }),
    new PoiModel({
      id: 2,
      path: '/augsburg/en/locations/second_poi',
      title: 'second Event',
      availableLanguages: new Map(
        [['en', '/augsburg/de/locations/zwoter_poi'], ['ar', '/augsburg/ar/locations/zwoter_poi']]),
      location: new LocationModel({
        address: 'address',
        town: 'town',
        postcode: 'postcode'
      }),
      content: 'content',
      excerpt: 'excerpt',
      lastUpdate: moment('2016-01-07 10:36:24'),
      thumbnail: 'thumbnail'
    }),
    new PoiModel({
      id: 3,
      path: '/augsburg/en/locations/third_poi',
      title: 'third Event',
      availableLanguages: new Map(
        [['de', '/augsburg/de/locations/dritter_poi'], ['ar', '/augsburg/ar/locations/dritter_poi']]),
      location: new LocationModel({
        address: 'address',
        town: 'town',
        postcode: 'postcode'
      }),
      content: 'content',
      excerpt: 'excerpt',
      lastUpdate: moment('2016-01-07 10:36:24'),
      thumbnail: 'thumbnail'
    })
  ]

  const city = 'augsburg'
  const language = 'en'
  const dispatch = () => {}
  const routesMap = {}
  const cities = [
    new CityModel({
      name: 'Augsburg',
      code: 'augsburg',
      live: true,
      eventsEnabled: true,
      extrasEnabled: false,
      sortingName: 'Augsburg'
    })
  ]

  const t = (key: ?string): string => key || ''

  it('should render a Page if a poi is selected', () => {
    expect(shallow(
      <PoiPage pois={pois}
               t={t}
               city={city}
               cities={cities}
               language={language}
               dispatch={dispatch}
               path={'/augsburg/en/locations/third_poi'}
               poiId={'third_poi'}
               routesMap={routesMap} />
    )).toMatchSnapshot()
  })

  it('should render a Failure if poi is invalid', () => {
    expect(shallow(
      <PoiPage pois={pois}
               t={t}
               city={city}
               cities={cities}
               language={language}
               dispatch={dispatch}
               path={'/augsburg/en/locations/invalid_poi'}
               poiId={'invalid_poi'}
               routesMap={routesMap} />
    )).toMatchSnapshot()
  })

  it('should render a list of pois if no poi is selected', () => {
    expect(shallow(
      <PoiPage pois={pois}
               t={t}
               city={city}
               cities={cities}
               language={language}
               dispatch={dispatch}
               path={'/augsburg/en/locations'}
               poiId={undefined}
               routesMap={routesMap} />
    )).toMatchSnapshot()
  })
})
