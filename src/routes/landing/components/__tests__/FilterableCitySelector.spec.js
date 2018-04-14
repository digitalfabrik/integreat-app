import React from 'react'

import FilterableCitySelector from '../FilterableCitySelector'
import { shallow } from 'enzyme'
import CitySelector from 'routes/landing/components/CitySelector'
import CityModel from '../../../../modules/endpoint/models/CityModel'
import ScrollingSearchBox from '../../../../modules/common/components/ScrollingSearchBox'

jest.mock('react-i18next')

describe('FilterableCitySelector', () => {
  const cities = [
    new CityModel({
      name: 'City',
      code: 'city',
      live: true,
      eventsEnabled: false,
      extrasEnabled: false
    }),
    new CityModel({
      name: 'Other city',
      code: 'otherCity',
      live: true,
      eventsEnabled: false,
      extrasEnabled: false
    }),
    new CityModel({
      name: 'Not-live',
      code: 'nonlive',
      live: false,
      eventsEnabled: false,
      extrasEnabled: false
    }),
    new CityModel({
      name: 'Yet another city',
      code: 'yetanothercity',
      live: true,
      eventsEnabled: false,
      extrasEnabled: false
    })
  ]

  it('should render', () => {
    const component = shallow(
      <FilterableCitySelector
        language='de'
        cities={cities} />
    )

    expect(component).toMatchSnapshot()
  })

  it('should pass filterText to CitySelector and filter', () => {
    const wrapper = shallow(
        <FilterableCitySelector
          language='de'
          cities={cities} />
    )

    const search = wrapper.find(ScrollingSearchBox)
    search.prop('onFilterTextChange')('City')

    wrapper.update()
    const selector = wrapper.find(CitySelector)
    expect(selector.prop('filterText')).toEqual('City')
  })
})
