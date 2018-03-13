import React from 'react'
import { mount, shallow } from 'enzyme'
import ConnectedSearchInput, { SearchInput } from '../SearchInput'

describe('SearchInput', () => {
  it('should render', () => {
    const mockTranslate = jest.fn(text => text)
    expect(shallow(<SearchInput filterText={'Test'}
                                onFilterTextChange={() => {}}
                                t={mockTranslate} />)).toMatchSnapshot()
  })

  it('should render and space search', () => {
    const mockTranslate = jest.fn(text => text)
    expect(shallow(<SearchInput filterText={'Test'}
                                onFilterTextChange={() => {}}
                                t={mockTranslate}
                                spaceSearch />)).toMatchSnapshot()
  })

  describe('connect', () => {
    it('should render', () => {
      expect(shallow(<ConnectedSearchInput filterText={'Test'}
                                           onFilterTextChange={() => {}} />)).toMatchSnapshot()
    })
  })

  it('should pass onFilterTextChange and onClickInput', () => {
    const outerFilterTextChange = jest.fn()
    const onClickInput = jest.fn()
    const component = mount(<ConnectedSearchInput filterText={'Test'}
                                            onClickInput={onClickInput}
                                            onFilterTextChange={outerFilterTextChange} />)
    component.find('input').simulate('click')
    expect(onClickInput).toHaveBeenCalled()
    component.find('input').simulate('change', {target: {value: 'test'}})
    expect(outerFilterTextChange).toHaveBeenCalledWith('test')
  })
})
