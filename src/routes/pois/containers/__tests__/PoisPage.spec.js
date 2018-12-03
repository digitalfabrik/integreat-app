// @flow

import React from 'react'
import { PoiModel, LocationModel } from '@integreat-app/integreat-api-client'
import moment from 'moment-timezone'
import { PoisPage } from '../PoisPage'
import { shallow } from 'enzyme'
import List from '../../../../modules/common/components/List'

describe('PoisPage', () => {
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
  const t = (key: ?string): string => key || ''

  it('should render a Page if a poi is selected', () => {
    expect(shallow(
      <PoisPage pois={pois}
                t={t}
                city={city}
                language={language}
                path={'/augsburg/en/locations/third_poi'}
                poiId={'third_poi'} />
    )).toMatchSnapshot()
  })

  it('should render a Failure if poi is invalid', () => {
    expect(shallow(
      <PoisPage pois={pois}
                t={t}
                city={city}
                language={language}
                path={'/augsburg/en/locations/invalid_poi'}
                poiId={'invalid_poi'} />
    )).toMatchSnapshot()
  })

  it('should render a list of pois if no poi is selected', () => {
    expect(shallow(
      <PoisPage pois={pois}
                t={t}
                city={city}
                language={language}
                path={'/augsburg/en/locations'}
                poiId={undefined} />
    )).toMatchSnapshot()
  })

  it('should sort the pois alphabetically', () => {
    const tree = shallow(
      <PoisPage pois={[pois[2], pois[1], pois[0]]}
                t={t}
                city={city}
                language={language}
                path={'/augsburg/en/locations'}
                poiId={undefined} />
    )

    expect(tree.find(List).props().items).toEqual(pois)
  })
})
