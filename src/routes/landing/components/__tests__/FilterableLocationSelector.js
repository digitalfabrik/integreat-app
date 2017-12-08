import React from 'react'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'

import LocationModel from 'modules/endpoint/models/LocationModel'
import FilterableLocationSelector from '../FilterableLocationSelector'
import { mount } from 'enzyme'
import LocationSelector from 'routes/landing/components/LocationSelector'
import SearchInput from 'modules/common/components/SearchInput'
import mockStore from '__mocks__/store'

jest.mock('react-i18next')

describe('FilterableLocationSelector', () => {
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

  test('should render', () => {
    const component = renderer.create(
      <Provider store={mockStore}>
        <FilterableLocationSelector
          language="de"
          locations={locations}/>
      </Provider>
    )

    expect(component.toJSON()).toMatchSnapshot()
  })

  test('should pass filterText to LocationSelector and filter', () => {
    const wrapper = mount(
      <Provider store={mockStore}>
        <FilterableLocationSelector
          language="de"
          locations={locations}/>
      </Provider>
    )

    const search = wrapper.find(SearchInput)
    search.prop('onFilterTextChange')('City')

    const selector = wrapper.find(LocationSelector)
    expect(selector.instance().filter()).toHaveLength(3)
  })
})
