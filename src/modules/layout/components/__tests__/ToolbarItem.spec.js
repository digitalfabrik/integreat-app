import React from 'react'
import { mount, shallow } from 'enzyme'

import ToolbarItem from '../ToolbarItem'
import ReactTooltip from 'react-tooltip'

describe('ToolbarItem', () => {
  it('should render', () => {
    const component = shallow(<ToolbarItem href='http://example.com' name='testName' text='Click here!' />)
    expect(component).toMatchSnapshot()
  })

  it('should rebuild tooltip items on mount', () => {
    const original = ReactTooltip.rebuild
    ReactTooltip.rebuild = jest.fn()

    mount(<ToolbarItem href='http://example.com' name='testName' text='Click here!' />)
    expect(ReactTooltip.rebuild).toHaveBeenCalled()

    ReactTooltip.rebuild = original
  })
})
