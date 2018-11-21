// @flow

import { mount, shallow } from 'enzyme'
import React from 'react'

import { Payload, ExtraModel, CityModel, SprungbrettJobModel } from '@integreat-app/integreat-api-client'
import ConnectedSprungbrettExtraPage, { SprungbrettExtraPage } from '../SprungbrettExtraPage'

import createReduxStore from '../../../../modules/app/createReduxStore'
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

  const t = (key: ?string): string => key || ''

  it('should render list', () => {
    const sprunbrettPage = shallow(
      <SprungbrettExtraPage sprungbrettJobs={sprungbrettJobs}
                            city={city}
                            language={language}
                            extras={[sprungbrettExtra]}
                            cities={cities}
                            t={t} />
    )
    expect(sprunbrettPage).toMatchSnapshot()
  })

  it('should render error if extra is not supported', () => {
    const sprunbrettPage = shallow(
      <SprungbrettExtraPage sprungbrettJobs={sprungbrettJobs}
                            city={city}
                            language={language}
                            extras={[]}
                            cities={cities}
                            t={t} />
    )
    expect(sprunbrettPage).toMatchSnapshot()
  })

  it('should map state to props', () => {
    const offerHash = 'hASH'
    const location = {payload: {language, city, offerHash}}

    const store = createReduxStore({
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
