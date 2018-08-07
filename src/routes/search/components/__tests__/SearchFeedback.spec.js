import React from 'react'
import CityModel from '../../../../modules/endpoint/models/CityModel'
import { SEARCH_ROUTE } from '../../../../modules/app/routes/search'
import { SearchFeedback } from '../SearchFeedback'
import { shallow } from 'enzyme'

describe('SearchFeedback', () => {
  const cities = [
    new CityModel({
      name: 'Augsburg',
      code: 'augsburg',
      live: true,
      eventsEnabled: true,
      extrasEnabled: false
    })
  ]

  const t = key => key
  const location = {type: SEARCH_ROUTE, payload: {city: 'augsburg', language: 'de'}}

  it('should render a FeedbackBox if no results are found', () => {
    expect(shallow(
      <SearchFeedback
        cities={cities}
        route={SEARCH_ROUTE}
        location={location}
        query={'abc'}
        resultsFound={false}
        t={t} />
    )).toMatchSnapshot()
  })

  it('should render a FeedbackModal and FeedbackButton if results are found and the query is not empty', () => {
    expect(shallow(
      <SearchFeedback
        cities={cities}
        route={SEARCH_ROUTE}
        location={location}
        query={'ab'}
        resultsFound
        t={t} />
    )).toMatchSnapshot()
  })

  it('should render only a FeedbackModal if results are found and the query is empty', () => {
    expect(shallow(
      <SearchFeedback
        cities={cities}
        route={SEARCH_ROUTE}
        location={location}
        query={''}
        resultsFound
        t={t} />
    )).toMatchSnapshot()
  })
})
