import React from 'react'
import { shallow, render } from 'enzyme'

import ListItem from '../ListItem'

// TODO write a proper test

describe('ListItem', () => {
  const path = '/augsburg/en/events/first_event'
  const pathExternal = 'https://tuerantuer.org'

  it('should render a Link and match snapshot', () => {
    expect(render(<ListItem thumbnail='thumbnail' title='first Event' path={path} />)).toMatchSnapshot()
  })

  it('should render an Anchor and match snapshot', () => {
    expect(render(<ListItem thumbnail='thumbnail' title='first Event' path={pathExternal} />)).toMatchSnapshot()
  })
})
