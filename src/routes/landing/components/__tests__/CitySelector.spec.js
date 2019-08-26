// @flow

import React from 'react'
import { shallow } from 'enzyme'

import { CityModel } from '@integreat-app/integreat-api-client'

import CitySelector from '../CitySelector'

describe('CitySelector', () => {
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
      sortingName: 'OtherCity'
    }),
    new CityModel({
      name: 'Notlive',
      code: 'nonlive',
      live: false,
      eventsEnabled: false,
      extrasEnabled: false,
      sortingName: 'Nonlive'
    }),
    new CityModel({
      name: 'Yet another city',
      code: 'yetanothercity',
      live: true,
      eventsEnabled: false,
      extrasEnabled: false,
      sortingName: 'Yetanothercity'
    })
  ]

  it('should render', () => {
    shallow(
      <CitySelector
        filterText='Text'
        language='de'
        cities={cities} />
    )
  })

  it('should filter for existing and live cities', () => {
    const wrapper = shallow(<CitySelector
      filterText='city'
      language='de'
      cities={cities} />
    )

    const component = wrapper.instance()

    expect(component.filter()).toMatchSnapshot()
  })

  it('should exclude location if location does not exist', () => {
    const wrapper = shallow(<CitySelector
      filterText='Does not exist'
      language='de'
      cities={cities} />
    )

    const component = wrapper.instance()
    expect(component.filter()).toMatchSnapshot()
  })

  it('should exclude location if location is not live', () => {
    const wrapper = shallow(<CitySelector
      filterText='notlive'
      language='de'
      cities={cities} />
    )

    const component = wrapper.instance()
    expect(component.filter()).toMatchSnapshot()
  })

  it('should filter for all non-live cities if filterText is "wirschaffendas"', () => {
    const wrapper = shallow(<CitySelector
      filterText='wirschaffendas'
      language='de'
      cities={cities} />
    )

    const component = wrapper.instance()
    expect(component.filter()).toMatchSnapshot()
  })
})
