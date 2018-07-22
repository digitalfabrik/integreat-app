import React from 'react'
import { mount, shallow } from 'enzyme'

import ReactTooltip from 'react-tooltip'
import ToolbarButton from '../ToolbarButton'

describe('ToolbarButton', () => {
  it('should render', () => {
    const component = shallow(<ToolbarButton name='testName' text='Click here!' onClick={() => {}} />)
    expect(component).toMatchSnapshot()
  })

  it('should rebuild tooltip items on mount', () => {
    const original = ReactTooltip.rebuild
    ReactTooltip.rebuild = jest.fn()

    mount(<ToolbarButton href='http://example.com' name='testName' text='Click here!' onClick={() =>{}} />)
    expect(ReactTooltip.rebuild).toHaveBeenCalled()

    ReactTooltip.rebuild = original
  })
})
