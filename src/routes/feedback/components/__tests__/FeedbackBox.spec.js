import React from 'react'
import { shallow } from 'enzyme'

import { CATEGORIES_ROUTE } from '../../../../modules/app/routes/categories'
import CityModel from '../../../../modules/endpoint/models/CityModel'
import { FeedbackBox } from '../FeedbackBox'

describe('FeedbackBox', () => {
  const location = {type: CATEGORIES_ROUTE, payload: {city: 'augsburg', language: 'de'}}
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

  it('should render a FeedbackBox with Header', () => {
    const component = shallow(
      <FeedbackBox
        query={'ab'}
        location={location}
        cities={cities}
        isPositiveRatingSelected={false}
        isOpen
        t={t} />
    )
    expect(component).toMatchSnapshot()
  })

  it('should render a FeedbackBox without Header', () => {
    const component = shallow(
      <FeedbackBox
        query={'ab'}
        location={location}
        cities={cities}
        isPositiveRatingSelected={false}
        isOpen
        t={t}
        hideHeader />
    )
    expect(component).toMatchSnapshot()
  })
})
