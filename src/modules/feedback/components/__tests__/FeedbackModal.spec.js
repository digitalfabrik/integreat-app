// @flow

import React from 'react'
import { shallow } from 'enzyme'

import FeedbackModal from '../FeedbackModal'
import { CityModel } from '@integreat-app/integreat-api-client'
import { CATEGORIES_ROUTE } from '../../../app/route-configs/CategoriesRouteConfig'
import createLocation from '../../../../createLocation'

describe('FeedbackModal', () => {
  it('should match snapshot', () => {
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

    const location = createLocation({
      type: CATEGORIES_ROUTE, payload: {city: 'augsburg', language: 'de'}, query: {feedback: 'up'}})

    expect(shallow(
    <FeedbackModal
      location={location}
      query={'ab'}
      cities={cities}
      id={1234}
      title={'title'}
      alias='alias'
      closeFeedbackModal={() => {}}
      feedbackStatus={'up'} />
    )).toMatchSnapshot()
  })
})
