import { shallow } from 'enzyme'
import React from 'react'

import ExtraModel from 'modules/endpoint/models/ExtraModel'
import ConnectedExtrasPage, { ExtrasPage } from '../ExtrasPage'
import configureMockStore from 'redux-mock-store'
import CityModel from '../../../../modules/endpoint/models/CityModel'

describe('ExtrasPage', () => {
  const city = 'augsburg'
  const language = 'de'

  const sprungbrettExtra = new ExtraModel({
    alias: 'sprungbrett', path: 'path to fetch jobs from', title: 'Sprungbrett', thumbnail: 'xy'
  })

  const extras = [
    sprungbrettExtra,
    new ExtraModel({alias: 'ihk-lehrstellenboerse', path: 'ihk-jobborese.com', title: 'Jobboerse', thumbnail: 'xy'}),
    new ExtraModel({alias: 'ihk-praktikumsboerse', path: 'ihk-pratkitkumsboerse.com', title: 'Praktikumsboerse', thumbnail: 'xy'})
  ]

  const cities = [
    new CityModel({
      name: 'Augsburg',
      code: 'augsburg',
      live: true,
      eventsEnabled: true,
      extrasEnabled: false
    })
  ]

  it('should render extra tiles if no extra is selected', () => {
    const extrasPage = shallow(
      <ExtrasPage city={city}
                  language={language}
                  cities={cities}
                  extras={extras}
                  t={key => key} />
    )
    expect(extrasPage).toMatchSnapshot()
  })

  it('should map state to props', () => {
    const location = {payload: {language, city}}

    const mockStore = configureMockStore()
    const store = mockStore({
      location: location,
      extras: {data: extras},
      cities: {data: cities}
    })

    const extrasPage = shallow(
      <ConnectedExtrasPage store={store} />
    )

    expect(extrasPage.props()).toEqual({
      language,
      city,
      extras,
      cities,
      store: store,
      storeSubscription: expect.any(Object),
      dispatch: expect.any(Function)
    })
  })
})
