import { fireEvent } from '@testing-library/react'
import React from 'react'

import { renderWithTheme } from '../../testing/render'
import SearchInput from '../SearchInput'

describe('SearchInput', () => {
  it('should pass onFilterTextChange and onClickInput', () => {
    const outerFilterTextChange = jest.fn()
    const onClickInput = jest.fn()
    const { getByPlaceholderText } = renderWithTheme(
      <SearchInput
        filterText='Test'
        placeholderText='Placeholder'
        onClickInput={onClickInput}
        onFilterTextChange={outerFilterTextChange}
      />
    )
    fireEvent.click(getByPlaceholderText('Placeholder'))
    expect(onClickInput).toHaveBeenCalled()

    fireEvent.change(getByPlaceholderText('Placeholder'), {
      target: {
        value: 'test',
      },
    })
    expect(outerFilterTextChange).toHaveBeenCalledWith('test')
  })
})
