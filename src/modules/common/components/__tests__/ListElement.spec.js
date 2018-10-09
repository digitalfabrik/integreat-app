// @flow

import React from 'react'
import { shallow } from 'enzyme'

import ListElement from '../ListElement'

describe('ListElement', () => {
  const path = '/augsburg/en/events/first_event'

  it('should render a Link an match snapshot', () => {
    expect(shallow(
      <ListElement thumbnail={'thumbnail'}
                   title={'first Event'}
                   path={path}
                   isExternalUrl={false} />
    )).toMatchSnapshot()
  })

  it('should render an Anchor an match snapshot', () => {
    expect(shallow(
      <ListElement thumbnail={'thumbnail'}
                   title={'first Event'}
                   path={path}
                   isExternalUrl />
    )).toMatchSnapshot()
  })
})
