import React from 'react'
import { shallow } from 'enzyme'
import CityModel from 'modules/endpoint/models/CityModel'

import ConnectedLocationLayout, { LocationLayout } from '../LocationLayout'
import configureMockStore from 'redux-mock-store'
import CategoriesMapModel from '../../../endpoint/models/CategoriesMapModel'
import CategoryModel from '../../../endpoint/models/CategoryModel'
import { CATEGORIES_ROUTE } from '../../../app/routes/categories'

describe('LocationLayout', () => {
  const language = 'de'
  const pathname = '/augsburg/de/willkommen'
  const currentRoute = CATEGORIES_ROUTE

  const categories = new CategoriesMapModel([
    new CategoryModel({
      number: 1,
      path: 'path01',
      title: 'Title10',
      content: 'contnentl',
      thumbnail: 'thumb/nail',
      parentPath: 'parent/url',
      order: 4,
      availableLanguages: new Map()
    })
  ])

  const cities = [new CityModel({name: 'Mambo No. 5', code: 'city1'})]

  const MockNode = () => <div />

  it('should show LocationHeader and LocationFooter if City is available', () => {
    const component = shallow(
      <LocationLayout city='city1'
                      language={language}
                      categories={categories}
                      currentRoute={''}
                      pathname={pathname}
                      cities={cities}
                      viewportSmall>
        <MockNode />
      </LocationLayout>)
    expect(component).toMatchSnapshot()
  })

  it('should show CategoriesToolbar if current route is categories', () => {
    const component = shallow(
      <LocationLayout city='city1'
                      language={language}
                      categories={categories}
                      currentRoute={CATEGORIES_ROUTE}
                      pathname={pathname}
                      cities={cities}
                      viewportSmall>
        <MockNode />
      </LocationLayout>)
    expect(component).toMatchSnapshot()
  })

  it('should show GeneralHeader and GeneralFooter if LocationModel is not available', () => {
    const component = shallow(
      <LocationLayout city='unavailableLocation'
                      categories={categories}
                      currentRoute={currentRoute}
                      pathname={pathname}
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
      type: currentRoute,
      pathname: pathname
    }

    const mockStore = configureMockStore()
    const store = mockStore({
      location: location,
      cities: {data: cities},
      categories: {data: categories},
      viewport: {is: {small: false}}
    })

    const locationLayout = shallow(
      <ConnectedLocationLayout store={store} />
    )

    expect(locationLayout.props()).toMatchObject({
      city,
      viewportSmall: false,
      language,
      cities,
      store,
      currentRoute,
      pathname,
      categories
    })
  })
})
