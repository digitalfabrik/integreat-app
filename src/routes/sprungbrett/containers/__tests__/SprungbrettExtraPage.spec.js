// @flow

import { mount, shallow } from 'enzyme'
import React from 'react'

import ExtraModel from '../../../../modules/endpoint/models/ExtraModel'
import ConnectedSprungbrettExtraPage, { SprungbrettExtraPage } from '../SprungbrettExtraPage'

import CityModel from '../../../../modules/endpoint/models/CityModel'
import Payload from '../../../../modules/endpoint/Payload'
import SprungbrettJobModel from '../../../../modules/endpoint/models/SprungbrettJobModel'
import createReduxStore from '../../../../modules/app/createReduxStore'
import createHistory from '../../../../modules/app/createHistory'
import theme from '../../../../modules/theme/constants/theme'
import { Provider } from 'react-redux'
import { ThemeProvider } from 'styled-components'

describe('SprungbrettExtraPage', () => {
  const city = 'augsburg'
  const language = 'de'

  const sprungbrettExtra = new ExtraModel({
    alias: 'sprungbrett', path: 'path to fetch jobs from', title: 'Sprungbrett', thumbnail: 'xy', postData: null
  })

  const extras = [sprungbrettExtra]

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

  const sprungbrettJobs = [
    new SprungbrettJobModel({
      id: 0,
      title: 'WebDeveloper',
      location: 'Augsburg',
      isEmployment: true,
      isApprenticeship: true,
      url: 'http://awesome-jobs.domain'
    }),
    new SprungbrettJobModel({
      id: 1,
      title: 'BackendDeveloper',
      location: 'Augsburg',
      isEmployment: true,
      isApprenticeship: false,
      url: 'http://awesome-jobs.domain'
    }),
    new SprungbrettJobModel({
      id: 2,
      title: 'Freelancer',
      location: 'Augsburg',
      isEmployment: false,
      isApprenticeship: true,
      url: 'http://awesome-jobs.domain'
    })
  ]

  it('should render list', () => {
    const sprunbrettPage = shallow(
      <SprungbrettExtraPage sprungbrettJobs={sprungbrettJobs}
                            city={city}
                            language={language}
                            extras={[sprungbrettExtra]}
                            cities={cities} />
    )
    expect(sprunbrettPage).toMatchSnapshot()
  })

  it('should render spinner if jobs are not ready', () => {
    const sprunbrettPage = shallow(
      <SprungbrettExtraPage sprungbrettJobs={null}
                            city={city}
                            language={language}
                            extras={[sprungbrettExtra]}
                            cities={cities} />
    )
    expect(sprunbrettPage).toMatchSnapshot()
  })

  it('should render error if extra is not supported', () => {
    const sprunbrettPage = shallow(
      <SprungbrettExtraPage sprungbrettJobs={sprungbrettJobs}
                            city={city}
                            language={language}
                            extras={[]}
                            cities={cities} />
    )
    expect(sprunbrettPage).toMatchSnapshot()
  })

  it('should map state to props', () => {
    const offerHash = 'hASH'
    const location = {payload: {language, city, offerHash}}

    const store = createReduxStore(createHistory, {
      extras: new Payload(false, null, extras),
      sprungbrettJobs: new Payload(false, null, sprungbrettJobs),
      cities: new Payload(false, null, cities)
    })
    store.getState().location = location

    const tree = mount(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <ConnectedSprungbrettExtraPage cities={cities} extras={extras} sprungbrettJobs={sprungbrettJobs} />
        </Provider>
      </ThemeProvider>
    )

    expect(tree.find(SprungbrettExtraPage).props()).toMatchObject({
      language,
      city,
      extras,
      cities,
      sprungbrettJobs
    })
  })
})
