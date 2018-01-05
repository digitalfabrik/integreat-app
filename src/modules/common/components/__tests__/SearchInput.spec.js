import React from 'react'
import { shallow } from 'enzyme'
import SearchInput from '../SearchInput'

describe('SearchInput', () => {
  test('should render', () => {
    expect(shallow(<SearchInput filterText={'Test'} onFilterTextChange={() => {}} />)).toMatchSnapshot()
  })

  test('should render and space search', () => {
    expect(shallow(<SearchInput filterText={'Test'}
                                onFilterTextChange={() => {}}
                                spaceSearch />)).toMatchSnapshot()
  })
})
