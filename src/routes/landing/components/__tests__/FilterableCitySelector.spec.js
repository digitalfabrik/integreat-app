import React from 'react'

import { FilterableCitySelector } from '../FilterableCitySelector'
import { shallow } from 'enzyme'
import CityModel from '../../../../modules/endpoint/models/CityModel'

describe('FilterableCitySelector', () => {
  const cities = [
    new CityModel({
      name: 'City',
      code: 'city',
      live: true,
      eventsEnabled: false,
      extrasEnabled: false,
      sortingName: 'City'
    }),
    new CityModel({
      name: 'Other city',
      code: 'otherCity',
      live: true,
      eventsEnabled: false,
      extrasEnabled: false,
      sortingName: 'Other City'
    }),
    new CityModel({
      name: 'Not-live',
      code: 'nonlive',
      live: false,
      eventsEnabled: false,
      extrasEnabled: false,
      sortingName: 'Not-live'
    }),
    new CityModel({
      name: 'Yet another city',
      code: 'yetanothercity',
      live: true,
      eventsEnabled: false,
      extrasEnabled: false,
      sortingName: 'Yet another city'
    })
  ]

  it('should render', () => {
    const component = shallow(
      <FilterableCitySelector
        language='de'
        cities={cities}
        t={key => key} />
    )

    expect(component).toMatchSnapshot()
  })

  it('should update filter text', () => {
    const wrapper = shallow(
        <FilterableCitySelector
          t={key => key}
          language='de'
          cities={cities} />
    )

    wrapper.instance().onFilterTextChange('City')
    expect(wrapper).toMatchSnapshot()
  })
})
