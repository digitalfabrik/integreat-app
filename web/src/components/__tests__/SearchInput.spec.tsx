import React from 'react'
import SearchInput from '../SearchInput'
import { ThemeProvider } from 'styled-components'
import buildConfig from '../../constants/buildConfig'
import { fireEvent, render } from '@testing-library/react'

describe('SearchInput', () => {
  it('should pass onFilterTextChange and onClickInput', () => {
    const outerFilterTextChange = jest.fn()
    const onClickInput = jest.fn()
    const { getByPlaceholderText } = render(
      <ThemeProvider theme={buildConfig().lightTheme}>
        <SearchInput
          filterText='Test'
          placeholderText='Placeholder'
          onClickInput={onClickInput}
          onFilterTextChange={outerFilterTextChange}
        />
      </ThemeProvider>
    )
    fireEvent.click(getByPlaceholderText('Placeholder'))
    expect(onClickInput).toHaveBeenCalled()

    fireEvent.change(getByPlaceholderText('Placeholder'), {
      target: {
        value: 'test'
      }
    })
    expect(outerFilterTextChange).toHaveBeenCalledWith('test')
  })
})
