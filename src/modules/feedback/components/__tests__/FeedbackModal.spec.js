// @flow

import React from 'react'
import { shallow } from 'enzyme'

import { FeedbackModal } from '../FeedbackModal'
import { CityModel } from '@integreat-app/integreat-api-client'
import { CATEGORIES_ROUTE } from '../../../app/route-configs/CategoriesRouteConfig'
import createLocation from '../../../../createLocation'
import theme from '../../../theme/constants/theme'

describe('FeedbackModal', () => {
  it('should match snapshot', () => {
    const cities = [
      new CityModel({
        name: 'Augsburg',
        code: 'augsburg',
        live: true,
        eventsEnabled: true,
        extrasEnabled: false,
        pushNotificationsEnabled: false,
        tunewsEnabled: false,
        sortingName: 'Augsburg'
      })
    ]

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
                     theme={theme} />
    )).toMatchSnapshot()
  })
})
