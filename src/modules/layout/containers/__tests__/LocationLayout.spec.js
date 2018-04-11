import React from 'react'
import { shallow } from 'enzyme'
import CityModel from 'modules/endpoint/models/CityModel'

import ConnectedLocationLayout, { LocationLayout } from '../LocationLayout'
import configureMockStore from 'redux-mock-store'
import CategoriesMapModel from '../../../endpoint/models/CategoriesMapModel'
import CategoryModel from '../../../endpoint/models/CategoryModel'
import Layout from '../../components/Layout'

describe('LocationLayout', () => {
  const language = 'de'

  const cities = [new CityModel({name: 'Mambo No. 5', code: 'city1'})]

  const MockNode = () => <div />

  it('should show LocationHeader and LocationFooter if City is available', () => {
    const component = shallow(
      <LocationLayout city='city1'
                      language={language}
                      cities={cities}
                      viewportSmall>
        <MockNode />
      </LocationLayout>)
    expect(component).toMatchSnapshot()
  })

  it('should show GeneralHeader and GeneralFooter if LocationModel is not available', () => {
    const component = shallow(
      <LocationLayout city='unavailableLocation'
                      language={language}
                      cities={cities}
                      viewportSmall>
        <MockNode />
      </LocationLayout>)
    expect(component).toMatchSnapshot()
  })

  it('should map state to props', () => {
    const city = 'city'
    const location = {
      payload: {city, language},
      type
    }

    const mockStore = configureMockStore()
    const store = mockStore({
      location: location,
      cities: {data: cities},
      viewport: {is: {small: false}}
    })

    const locationLayout = shallow(
      <ConnectedLocationLayout store={store} />
    )

    expect(locationLayout.props()).toEqual({
      city,
      viewportSmall: false,
      language,
      cities,
      store,
      dispatch: expect.any(Function),
      storeSubscription: expect.any(Object)
    })
  })

  it('should pass onStickyTopChanged to LocationHeader and asideStickyTop to Layout', () => {
    const component = shallow(
      <LocationLayout city='city1'
                      language={language}
                      languages={languages}
                      categories={categories}
                      cities={cities}
                      viewportSmall
                      currentRoute={EXTRAS_ROUTE}>
        <MockNode />
      </LocationLayout>)
    const header = shallow(component.prop('header'))
    header.prop('onStickyTopChanged')(50)
    component.update()
    expect(component.find(Layout).prop('asideStickyTop')).toEqual(50)
  })
})
