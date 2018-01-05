import React from 'react'
import { shallow } from 'enzyme'
import { SearchInput } from '../SearchInput'

describe('SearchInput', () => {
  test('should render', () => {
    const mockTranslate = jest.fn((text) => text)
    expect(shallow(<SearchInput filterText={'Test'}
                                onFilterTextChange={() => {}}
                                t={mockTranslate} />)).toMatchSnapshot()
  })

  test('should render and space search', () => {
    const mockTranslate = jest.fn((text) => text)
    expect(shallow(<SearchInput filterText={'Test'}
                                onFilterTextChange={() => {}}
                                t={mockTranslate}
                                spaceSearch />)).toMatchSnapshot()
  })
})
