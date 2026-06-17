import { fireEvent } from '@testing-library/react'
import React from 'react'

import { renderWithTheme } from '../../testing/render'
import SearchInput from '../SearchInput'

jest.mock('react-i18next')
jest.mock('stylis')

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
      />,
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

  it('should blur the input when pressing Enter to dismiss the keyboard', () => {
    const { getByPlaceholderText } = renderWithTheme(
      <SearchInput filterText='Test' placeholderText='Placeholder' onFilterTextChange={jest.fn()} />,
    )
    const input = getByPlaceholderText('Placeholder')
    input.focus()
    expect(input).toHaveFocus()

    fireEvent.keyDown(input, { key: 'Enter' })
    expect(input).not.toHaveFocus()
  })
})
