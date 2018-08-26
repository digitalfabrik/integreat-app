// @flow

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
    alias: 'sprungbrett', path: 'path to fetch jobs from', title: 'Sprungbrett', thumbnail: 'xy', postData: null
  })

  const lehrstellenRadarPostData = new Map()
  lehrstellenRadarPostData.set('partner', '0006')
  lehrstellenRadarPostData.set('radius', '50')
  lehrstellenRadarPostData.set('plz', '86150')

  const extras = [
    sprungbrettExtra,
    new ExtraModel({
      alias: 'ihk-lehrstellenboerse',
      path: 'ihk-jobborese.com',
      title: 'Jobboerse',
      thumbnail: 'xy',
      postData: lehrstellenRadarPostData
    }),
    new ExtraModel({
      alias: 'ihk-praktikumsboerse',
      path: 'ihk-pratkitkumsboerse.com',
      title: 'Praktikumsboerse',
      thumbnail: 'xy',
      postData: null
    })
  ]

  const cities = [
    new CityModel({
      name: 'Augsburg',
      code: 'augsburg',
      live: true,
      eventsEnabled: true,
      extrasEnabled: false,
      sortingName: 'Augsburg'
    })
  ]

  const t = (key: ?string): string => key || ''

  it('should render extra tiles if no extra is selected', () => {
    const extrasPage = shallow(
      <ExtrasPage city={city}
                  language={language}
                  cities={cities}
                  extras={extras}
                  t={t} />
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
      <ConnectedExtrasPage store={store} cities={cities} extras={extras} />
    )

    expect(extrasPage.props()).toMatchObject({
      language,
      city,
      extras,
      cities
    })
  })
})
