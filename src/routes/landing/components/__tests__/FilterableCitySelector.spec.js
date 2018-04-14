import React from 'react'
import { Provider } from 'react-redux'

import FilterableCitySelector from '../FilterableCitySelector'
import { mount, shallow } from 'enzyme'
import CitySelector from 'routes/landing/components/CitySelector'
import SearchInput from 'modules/common/components/SearchInput'
import CityModel from '../../../../modules/endpoint/models/CityModel'
import createReduxStore from '../../../../modules/app/createReduxStore'
import createHistory from '../../../../modules/app/createHistory'
import { ThemeProvider } from 'styled-components'
import theme from '../../../../modules/app/constants/theme'
import PlatformProvider from '../../../../modules/platform/containers/PlatformProvider'

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
  const store = createReduxStore(createHistory)

  it('should render', () => {
    const component = shallow(
      <FilterableCitySelector
        language='de'
        cities={cities} />
    )

    expect(component).toMatchSnapshot()
  })

  it('should pass filterText to CityCitySelector and filter', () => {
    const wrapper = mount(
      <PlatformProvider><ThemeProvider theme={theme}><Provider store={store}>
        <FilterableCitySelector
          language='de'
          cities={cities} />
        </Provider></ThemeProvider></PlatformProvider>
    )

    const search = wrapper.find(SearchInput)
    search.prop('onFilterTextChange')('City')

    const selector = wrapper.find(CitySelector)
    expect(selector.instance().filter()).toHaveLength(3)
  })
})
