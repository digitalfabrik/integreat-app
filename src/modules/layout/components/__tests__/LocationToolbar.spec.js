// @flow

import React from 'react'
import { shallow } from 'enzyme'

import LocationToolbar from '../LocationToolbar'
import { EVENTS_ROUTE } from '../../../app/routes/events'

describe('LocationToolbar', () => {
  it('should match snapshot', () => {
    const location = {type: EVENTS_ROUTE, pathname: '/augsburg/de/events', payload: {city: 'augsburg', language: 'de'}}
    const component = shallow(
      <LocationToolbar location={location} />
    )

    expect(component).toMatchSnapshot()
  })
})
