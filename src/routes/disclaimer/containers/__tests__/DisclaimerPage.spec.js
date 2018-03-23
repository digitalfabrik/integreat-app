import React from 'react'
import { mount, shallow } from 'enzyme'
import { Provider } from 'react-redux'

import ConnectedDisclaimerPage, { DisclaimerPage } from '../DisclaimerPage'
import DisclaimerModel from 'modules/endpoint/models/DisclaimerModel'
import configureMockStore from 'redux-mock-store'

describe('DisclaimerPage', () => {
  const disclaimer = new DisclaimerModel({
    id: 1689, title: 'Feedback, Kontakt und mögliches Engagement', content: 'this is a test content'
  })

  it('should match snapshot', () => {
    const wrapper = shallow(
      <DisclaimerPage disclaimer={disclaimer} />)
    expect(wrapper).toMatchSnapshot()
  })

  describe('connect', () => {
    const mockStore = configureMockStore()
    const store = mockStore({disclaimer: {data: disclaimer}})

    it('should map state and fetched data to props', () => {
      const disclaimerPage = mount(
        <Provider store={store}>
          <ConnectedDisclaimerPage />
        </Provider>
      ).find(DisclaimerPage)

      expect(disclaimerPage.props()).toEqual({
        disclaimer: disclaimer,
        dispatch: expect.any(Function)
      })
    })
  })
})
