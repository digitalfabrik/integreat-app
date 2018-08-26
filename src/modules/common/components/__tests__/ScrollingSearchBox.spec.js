// @flow

import React from 'react'
import { mount, shallow } from 'enzyme'
import ScrollingSearchBox from '../ScrollingSearchBox'
import SearchInput from '../SearchInput'
import { ThemeProvider } from 'styled-components'
import theme from '../../../theme/constants/theme'

describe('ScrollingSearchBox', () => {
  const MockNode = () => <div />

  it('should render', () => {
    const component = (
      <ScrollingSearchBox filterText={'Test'}
                          placeholderText={'Placeholder'}
                          onFilterTextChange={() => {}}>
        <MockNode />
      </ScrollingSearchBox>)
    expect(shallow(component)).toMatchSnapshot()
  })

  it('should space search', () => {
    expect(shallow(<ScrollingSearchBox filterText={'Test'}
                                       placeholderText={'Placeholder'}
                                       onFilterTextChange={() => {}}
                                       spaceSearch><MockNode /></ScrollingSearchBox>)).toMatchSnapshot()
  })

  it('should pass onFilterTextChange', () => {
    const outerFilterTextChange = jest.fn()
    const component = mount(
      <ThemeProvider theme={theme}>
        <ScrollingSearchBox filterText={'Test'}
                            placeholderText={'Placeholder'}
                            onFilterTextChange={outerFilterTextChange}>
          <MockNode />
        </ScrollingSearchBox>
      </ThemeProvider>).find(ScrollingSearchBox)

    component.find(SearchInput).prop('onFilterTextChange')('test')

    expect(outerFilterTextChange).toHaveBeenCalledWith('test')
  })

  it('should set correct reference', () => {
    const component = mount(
      <ThemeProvider theme={theme}>
        <ScrollingSearchBox filterText={'Test'}
                            onFilterTextChange={() => {}}
                            placeholderText={'Placeholder'}>
          <MockNode />
        </ScrollingSearchBox>
      </ThemeProvider>).find(ScrollingSearchBox)
    const node = component.instance()._node
    expect(node).toMatchSnapshot()
  })
})
