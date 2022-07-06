import { shallow } from 'enzyme'
import React from 'react'

import PageDetail from '../PageDetail'

describe('PageDetail', () => {
  const identifier = 'Date'
  const information = 'May 22, 2020 1:00 AM'

  it('should render', () => {
    const component = shallow(<PageDetail identifier={identifier} information={information} />)
    expect(component.childAt(0).text()).toBe(`${identifier}: `)
    expect(component.childAt(1).text()).toBe(information)
  })
})
