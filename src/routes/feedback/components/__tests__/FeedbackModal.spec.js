import React from 'react'
import { shallow } from 'enzyme'

import FeedbackModal from '../FeedbackModal'
import CityModel from '../../../../modules/endpoint/models/CityModel'
import { CATEGORIES_ROUTE } from '../../../../modules/app/routes/categories'

describe('FeedbackComment', () => {
  it('should match snapshot', () => {
    const cities = [
      new CityModel({
        name: 'Augsburg',
        code: 'augsburg',
        live: true,
        eventsEnabled: true,
        extrasEnabled: false
      })
    ]

    expect(shallow(
    <FeedbackModal
      query={'ab'}
      city={'augsburg'}
      cities={cities}
      language={'de'}
      route={CATEGORIES_ROUTE}
      pathname={'/augsburg/de'}
      id={1234}
      title={'title'}
      alias='alias'
      isPositiveRatingSelected
      isOpen
      commentMessageOverride='wantedInformation' />
    )).toMatchSnapshot()
  })
})
