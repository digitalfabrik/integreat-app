import React from 'react'
import { mount, shallow } from 'enzyme'
import ConnectedSearchInput, { SearchInput } from '../SearchInput'
import theme from '../../../app/constants/theme'
import { ThemeProvider } from 'styled-components'

describe('SearchInput', () => {
  it('should render', () => {
    const mockTranslate = jest.fn(text => text)
    expect(shallow(<SearchInput filterText={'Test'}
                                placeholderText={'Placeholder'}
                                onFilterTextChange={() => {}}
                                t={mockTranslate} />)).toMatchSnapshot()
  })

  it('should render and space search', () => {
    const mockTranslate = jest.fn(text => text)
    expect(shallow(<SearchInput filterText={'Test'}
                                placeholderText={'Placeholder'}
                                onFilterTextChange={() => {}}
                                t={mockTranslate}
                                spaceSearch />)).toMatchSnapshot()
  })

  describe('connect', () => {
    it('should render', () => {
      expect(shallow(<ConnectedSearchInput filterText={'Test'}
                                           placeholderText={'Placeholder'}
                                           onFilterTextChange={() => {}} />)).toMatchSnapshot()
    })
  })

  it('should pass onFilterTextChange and onClickInput', () => {
    const outerFilterTextChange = jest.fn()
    const onClickInput = jest.fn()
    const component = mount(
      <ThemeProvider theme={theme}>
        <ConnectedSearchInput filterText={'Test'}
                              placeholderText={'Placeholder'}
                              onClickInput={onClickInput}
                              onFilterTextChange={outerFilterTextChange} />
      </ThemeProvider>
    )
    component.find('input').simulate('click')
    expect(onClickInput).toHaveBeenCalled()
    component.find('input').simulate('change', {target: {value: 'test'}})
    expect(outerFilterTextChange).toHaveBeenCalledWith('test')
  })
})
