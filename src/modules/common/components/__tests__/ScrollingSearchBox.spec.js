import React from 'react'
import { mount, shallow } from 'enzyme'
import ScrollingSearchBox from '../ScrollingSearchBox'
import SearchInput from '../SearchInput'
import { animateScroll } from 'react-scroll'
import { ThemeProvider } from 'styled-components'
import theme from '../../../app/constants/theme'

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

  it('should pass onFilterTextChange and call scroll()', () => {
    const outerFilterTextChange = jest.fn()
    const component = mount(
      <ThemeProvider theme={theme}>
        <ScrollingSearchBox filterText={'Test'}
                            placeholderText={'Placeholder'}
                            onFilterTextChange={outerFilterTextChange}>
          <MockNode />
        </ScrollingSearchBox>
      </ThemeProvider>).find(ScrollingSearchBox)
    component.instance().scroll = jest.fn()

    component.find(SearchInput).prop('onFilterTextChange')('test')

    expect(outerFilterTextChange).toHaveBeenCalledWith('test')
    expect(component.instance().scroll).toHaveBeenCalled()
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

  it('shouldnt call scroll() if user is already below searchInput onClick', () => {
    const component = mount(
      <ThemeProvider theme={theme}>
        <ScrollingSearchBox filterText={'Test'}
                            onFilterTextChange={() => {}}
                            placeholderText={'Placeholder'}>
          <MockNode />
        </ScrollingSearchBox>
      </ThemeProvider>).find(ScrollingSearchBox)

    component.instance().scroll = jest.fn()
    component.instance()._node = {offsetTop: 15}
    document.documentElement.scrollTop = 15

    component.find(SearchInput).prop('onClickInput')()
    expect(component.instance().scroll).toHaveLength(0)
  })

  it('should call scroll() if user is above searchInput onClick', () => {
    const component = mount(
      <ThemeProvider theme={theme}>
        <ScrollingSearchBox filterText={'Test'}
                            onFilterTextChange={() => {}}
                            placeholderText={'Placeholder'}>
          <MockNode />
        </ScrollingSearchBox>
      </ThemeProvider>).find(ScrollingSearchBox)

    component.instance().scroll = jest.fn()
    component.instance()._node = {offsetTop: 15}
    document.documentElement.scrollTop = 0

    component.find(SearchInput).prop('onClickInput')()
    expect(component.instance().scroll).toHaveBeenCalled()
  })

  it('should call animateScroll on scroll()', () => {
    const component = mount(
      <ThemeProvider theme={theme}>
        <ScrollingSearchBox filterText={'Test'}
                            onFilterTextChange={() => {}}
                            placeholderText={'Placeholder'}>
          <MockNode />
        </ScrollingSearchBox>
      </ThemeProvider>).find(ScrollingSearchBox)

    component.instance()._node = {offsetTop: 15}
    component.instance().scroll()

    expect(animateScroll.scrollTo).toHaveBeenCalledWith(15, {duration: 500})
  })
})
