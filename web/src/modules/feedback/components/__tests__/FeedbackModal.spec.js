// @flow

import React from 'react'
import { shallow } from 'enzyme'
import { FeedbackModal } from '../FeedbackModal'
import { CityModel } from 'api-client'
import { CATEGORIES_ROUTE } from '../../../app/route-configs/CategoriesRouteConfig'
import createLocation from '../../../../createLocation'
import OffersModelBuilder from 'api-client/src/testing/OffersModelBuilder'

jest.mock('react-i18next')

describe('FeedbackModal', () => {
  it('should match snapshot', () => {
    const cities = [
      new CityModel({
        name: 'Augsburg',
        code: 'augsburg',
        live: true,
        eventsEnabled: true,
        offersEnabled: false,
        pushNotificationsEnabled: false,
        tunewsEnabled: false,
        poisEnabled: true,
        sortingName: 'Augsburg',
        latitude: null,
        longitude: null,
        aliases: null,
        prefix: null
      })
    ]
    const offers = new OffersModelBuilder(2).build()

    const location = createLocation({
      type: CATEGORIES_ROUTE, payload: { city: 'augsburg', language: 'de' }, query: { feedback: 'up' }
    })

    expect(shallow(
      <FeedbackModal location={location}
                     query='ab'
                     cities={cities}
                     path='path'
                     title='title'
                     alias='alias'
                     closeFeedbackModal={() => {}}
                     feedbackRating='up'
                     offers={offers} />
    )).toMatchSnapshot()
  })
})
