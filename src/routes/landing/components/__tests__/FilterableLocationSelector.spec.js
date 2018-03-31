import React from 'react'
import { Provider } from 'react-redux'

import FilterableLocationSelector from '../FilterableLocationSelector'
import { mount, shallow } from 'enzyme'
import LocationSelector from 'routes/landing/components/LocationSelector'
import SearchInput from 'modules/common/components/SearchInput'
import CityModel from '../../../../modules/endpoint/models/CityModel'
import createReduxStore from '../../../../modules/app/createReduxStore'
import createHistory from '../../../../modules/app/createHistory'
import { ThemeProvider } from 'styled-components'
import theme from '../../../../modules/app/constants/theme'

jest.mock('react-i18next')

describe('FilterableLocationSelector', () => {
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
  const store = createReduxStore(createHistory)

  it('should render', () => {
    const component = shallow(
      <FilterableLocationSelector
        language='de'
        cities={cities} />
    )

    expect(component).toMatchSnapshot()
  })

  it('should pass filterText to LocationSelector and filter', () => {
    const wrapper = mount(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
        <FilterableLocationSelector
          language='de'
          cities={cities} />
      </Provider></ThemeProvider>
    )

    const search = wrapper.find(SearchInput)
    search.prop('onFilterTextChange')('City')

    const selector = wrapper.find(LocationSelector)
    expect(selector.instance().filter()).toHaveLength(3)
  })
})
