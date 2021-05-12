// @flow

import React from 'react'
import { mount, shallow } from 'enzyme'
import ScrollingSearchBox from '../ScrollingSearchBox'
import SearchInput from '../SearchInput'
import { ThemeProvider } from 'styled-components'
import theme from '../../../theme/constants/theme'
import Headroom from '@integreat-app/react-sticky-headroom'

describe('ScrollingSearchBox', () => {
  const MockNode = () => <div />
  const onStickyTopChanged = () => {}

  it('should render', () => {
    const component = (
      <ScrollingSearchBox
        filterText='Test'
        placeholderText='Placeholder'
        onFilterTextChange={() => {}}
        onStickyTopChanged={onStickyTopChanged}>
        <MockNode />
      </ScrollingSearchBox>
    )
    expect(shallow(component)).toMatchSnapshot()
  })

  it('should space search', () => {
    expect(
      shallow(
        <ScrollingSearchBox
          filterText='Test'
          placeholderText='Placeholder'
          onFilterTextChange={() => {}}
          spaceSearch
          onStickyTopChanged={onStickyTopChanged}>
          <MockNode />
        </ScrollingSearchBox>
      )
    ).toMatchSnapshot()
  })

  it('should pass onFilterTextChange and onStickyTopChanged', () => {
    const outerFilterTextChange = jest.fn()
    const outerStickyTopChanged = jest.fn()
    const component = mount(
      <ThemeProvider theme={theme}>
        <ScrollingSearchBox
          filterText='Test'
          placeholderText='Placeholder'
          onFilterTextChange={outerFilterTextChange}
          onStickyTopChanged={outerStickyTopChanged}>
          <MockNode />
        </ScrollingSearchBox>
      </ThemeProvider>
    ).find(ScrollingSearchBox)

    component.find(SearchInput).prop('onFilterTextChange')('test')
    component.find(Headroom).prop('onStickyTopChanged')(5)

    expect(outerFilterTextChange).toHaveBeenCalledWith('test')
    expect(outerStickyTopChanged).toHaveBeenCalledWith(5)
  })

  it('should set correct reference', () => {
    const component = mount(
      <ThemeProvider theme={theme}>
        <ScrollingSearchBox
          filterText='Test'
          onFilterTextChange={() => {}}
          placeholderText='Placeholder'
          onStickyTopChanged={onStickyTopChanged}>
          <MockNode />
        </ScrollingSearchBox>
      </ThemeProvider>
    ).find(ScrollingSearchBox)
    const node = component.instance()._node
    expect(node).toMatchSnapshot()
  })
})
