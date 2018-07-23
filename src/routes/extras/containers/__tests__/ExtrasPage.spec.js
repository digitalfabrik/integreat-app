import { shallow } from 'enzyme'
import React from 'react'

import ExtraModel from 'modules/endpoint/models/ExtraModel'
import ConnectedExtrasPage, { ExtrasPage } from '../ExtrasPage'
import SprungbrettJobModel from '../../../../modules/endpoint/models/SprungbrettJobModel'
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

  const jobs = [
    new SprungbrettJobModel({
      id: '0', title: 'WebDeveloper', location: 'Augsburg', isEmployment: true, isApprenticeship: true
    }),
    new SprungbrettJobModel({
      id: '1', title: 'BackendDeveloper', location: 'Augsburg', isEmployment: true, isApprenticeship: false
    }),
    new SprungbrettJobModel({
      id: '2', title: 'Freelancer', location: 'Augsburg', isEmployment: false, isApprenticeship: true
    })
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

  it('should render a sprungbrett list if it is the selected extra and the jobs have been fetched', () => {
    const extrasPage = shallow(
      <ExtrasPage city={city}
                  language={language}
                  extras={extras}
                  cities={cities}
                  internalExtra='sprungbrett'
                  sprungbrettJobs={jobs}
                  t={key => key} />
    )
    expect(extrasPage).toMatchSnapshot()
  })

  it('should render a loading spinner if it is the selected extra and the jobs have not been fetched', () => {
    const extrasPage = shallow(
      <ExtrasPage city={city}
                  language={language}
                  extras={extras}
                  cities={cities}
                  internalExtra='sprungbrett'
                  t={key => key} />
    )
    expect(extrasPage).toMatchSnapshot()
  })

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

  it('should render a failure if the selected extra does not exist', () => {
    const extrasPage = shallow(
      <ExtrasPage city={city}
                  language={language}
                  cities={cities}
                  extras={extras}
                  internalExtra={'no valid extra'}
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
