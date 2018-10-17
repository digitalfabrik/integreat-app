// @flow

import React from 'react'
import { shallow } from 'enzyme'

import ListItem from '../ListItem'

describe('ListItem', () => {
  const path = '/augsburg/en/events/first_event'

  it('should render a Link an match snapshot', () => {
    expect(shallow(
      <ListItem thumbnail={'thumbnail'}
                title={'first Event'}
                path={path}
                isExternalUrl={false} />
    )).toMatchSnapshot()
  })

  it('should render an Anchor an match snapshot', () => {
    expect(shallow(
      <ListItem thumbnail={'thumbnail'}
                title={'first Event'}
                path={path}
                isExternalUrl />
    )).toMatchSnapshot()
  })
})
