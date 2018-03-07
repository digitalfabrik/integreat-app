import { shallow, mount } from 'enzyme'
import React from 'react'
import { Provider } from 'react-redux'

import createReduxStore from 'modules/app/createReduxStore'
import createHistory from 'modules/app/createHistory'
import EndpointBuilder from 'modules/endpoint/EndpointBuilder'
import EndpointProvider from 'modules/endpoint/EndpointProvider'
import SprungbrettJobModel from 'modules/endpoint/models/SprungbrettJobModel'
import ConnectedSprungbrettPage, { SprungbrettPage } from '../SprungbrettPage'

describe('SprungbrettPage', () => {
  const location = 'augsburg'
  const language = 'de'

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

  it('it should render a list with all jobs', () => {
    const component = shallow(
      <SprungbrettPage sprungbrett={jobs} title={'Sprungbrett'} />
    )
    expect(component).toMatchSnapshot()
  })

  describe('connect', () => {
    const sprungbrettEndpoint = new EndpointBuilder('sprungbrett')
      .withStateToUrlMapper(() => 'https://weird-endpoint/api.json')
      .withMapper(json => json)
      .withResponseOverride(jobs)
      .build()

    it('should map state to props', () => {
      const store = createReduxStore(createHistory, {
        router: {params: {location: location, language: language}}
      })

      const sprungbrettPage = mount(
        <Provider store={store}>
          <EndpointProvider endpoints={[sprungbrettEndpoint]}>
            <ConnectedSprungbrettPage />
          </EndpointProvider>
        </Provider>
      ).find(SprungbrettPage)

      expect(sprungbrettPage.props()).toEqual({sprungbrett: jobs})
    })
  })
})
