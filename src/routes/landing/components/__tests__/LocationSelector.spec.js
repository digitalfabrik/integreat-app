import React from 'react'
import { shallow } from 'enzyme'

import LocationModel from 'modules/endpoint/models/LocationModel'

import LocationSelector from '../LocationSelector'

describe('LocationSelector', () => {
  const locations = [
    new LocationModel({
      name: 'City',
      code: 'city',
      live: true,
      eventsEnabled: false,
      extrasEnabled: false
    }),
    new LocationModel({
      name: 'Other city',
      code: 'otherCity',
      live: true,
      eventsEnabled: false,
      extrasEnabled: false
    }),
    new LocationModel({
      name: 'Not-live',
      code: 'nonlive',
      live: false,
      eventsEnabled: false,
      extrasEnabled: false
    }),
    new LocationModel({
      name: 'Yet another city',
      code: 'yetanothercity',
      live: true,
      eventsEnabled: false,
      extrasEnabled: false
    })
  ]

  it('should render', () => {
    shallow(
      <LocationSelector
        filterText='Text'
        language='de'
        locations={locations} />
    )
  })

  it('should filter for existing and live locations', () => {
    const wrapper = shallow(<LocationSelector
      filterText='city'
      language='de'
      locations={locations} />
    )

    const component = wrapper.instance()

    expect(component.filter()).toHaveLength(3)
  })

  it('should exclude location if location does not exist', () => {
    const wrapper = shallow(<LocationSelector
      filterText='Does not exist'
      language='de'
      locations={locations} />
    )

    const component = wrapper.instance()
    expect(component.filter()).toHaveLength(0)
  })

  it('should exclude location if location is not live', () => {
    const wrapper = shallow(<LocationSelector
      filterText='notlive'
      language='de'
      locations={locations} />
    )

    const component = wrapper.instance()
    expect(component.filter()).toHaveLength(0)
  })

  it('should filter for all non-live locations if filterText is "wirschaffendas"', () => {
    const wrapper = shallow(<LocationSelector
      filterText='wirschaffendas'
      language='de'
      locations={locations} />
    )

    const component = wrapper.instance()
    expect(component.filter()).toHaveLength(1)
  })
})
