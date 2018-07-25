import React from 'react'
import { mount, shallow } from 'enzyme'

import ToolbarAnchor from '../ToolbarAnchor'
import ReactTooltip from 'react-tooltip'

describe('ToolbarAnchor', () => {
  it('should render', () => {
    const component = shallow(<ToolbarAnchor href='http://example.com' name='testName' text='Click here!' />)
    expect(component).toMatchSnapshot()
  })

  it('should rebuild tooltip items on mount', () => {
    const original = ReactTooltip.rebuild
    ReactTooltip.rebuild = jest.fn()

    mount(<ToolbarAnchor href='http://example.com' name='testName' text='Click here!' />)
    expect(ReactTooltip.rebuild).toHaveBeenCalled()

    ReactTooltip.rebuild = original
  })
})
