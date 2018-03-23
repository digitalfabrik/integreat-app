/* eslint-disable react/jsx-boolean-value */
import React from 'react'
import { mount } from 'enzyme'

import ConditionalLink, { InactiveLink } from '../ConditionalLink'
import Link from 'redux-first-router-link'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'

describe('ConditionalLink', () => {
  it('should render a Link if active', () => {
    const mockStore = configureMockStore()
    const store = mockStore({location: {}})

    const tree = mount(<Provider store={store}>
        <ConditionalLink prob='value' active={true} href={{type: 'RANDOM_ROUTE'}} />
      </Provider>
    )
    const link = tree.find(Link)
    expect(link.length).not.toBe(0)
    expect(link.props()).toEqual({prob: 'value', href: {type: 'RANDOM_ROUTE'}})
  })

  it('should render a InactiveLink if inactive', () => {
    const tree = mount(<ConditionalLink prob='value' active={false} />)
    const disabledLink = tree.find(InactiveLink)
    expect(disabledLink.length).not.toBe(0)
    expect(disabledLink.props()).toEqual({prob: 'value'})
  })
})
