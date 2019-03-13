// @flow

import React from 'react'
import { CityModel } from '@integreat-app/integreat-api-client'
import { SEARCH_ROUTE } from '../../../../modules/app/route-configs/SearchRouteConfig'
import { SearchFeedback } from '../SearchFeedback'
import { shallow } from 'enzyme'
import createLocation from '../../../../createLocation'

describe('SearchFeedback', () => {
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
  const location = createLocation(
    {type: SEARCH_ROUTE, payload: {city: 'augsburg', language: 'de'}, query: {feedback: 'up'}})

  it('should render a NothingFoundFeedbackBox if no results are found', () => {
    expect(shallow(
      <SearchFeedback
        location={location}
        query={'abc'}
        resultsFound={false}
        t={t} />
    )).toMatchSnapshot()
  })

  it('should render a FeedbackButton if results are found and the query is not empty', () => {
    expect(shallow(
      <SearchFeedback
        location={location}
        query={'ab'}
        resultsFound
        t={t} />
    )).toMatchSnapshot()
  })

  it('should render neither a NothingFoundFeedbackBox nor a FeedbackButton', () => {
    expect(shallow(
      <SearchFeedback
        location={location}
        query={''}
        resultsFound
        t={t} />
    )).toMatchSnapshot()
  })
})
