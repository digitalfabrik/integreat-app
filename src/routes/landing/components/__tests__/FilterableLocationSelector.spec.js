import React from 'react'
import { Provider } from 'react-redux'

import LocationModel from 'modules/endpoint/models/CityModel'
import FilterableLocationSelector from '../FilterableLocationSelector'
import { mount, shallow } from 'enzyme'
import LocationSelector from 'routes/landing/components/LocationSelector'
import SearchInput from 'modules/common/components/SearchInput'
import configureMockStore from 'redux-mock-store'

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

  // todo
  /**
  const router = routerForBrowser({routes: {}})
  const mockStore = configureMockStore([router.middleware])

  it('should render', () => {
    const store = mockStore({router: {}})
    const component = shallow(
      <Provider store={store}>
        <FilterableLocationSelector
          language='de'
          locations={locations} />
      </Provider>
    )

    expect(component).toMatchSnapshot()
  })

  it('should pass filterText to LocationSelector and filter', () => {
    const store = mockStore({router: {}})
    const wrapper = mount(
      <Provider store={store}>
        <FilterableLocationSelector
          language='de'
          locations={locations} />
      </Provider>
    )

    const search = wrapper.find(SearchInput)
    search.prop('onFilterTextChange')('City')

    const selector = wrapper.find(LocationSelector)
    expect(selector.instance().filter()).toHaveLength(3)
  }) */
})
