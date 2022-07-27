import { fireEvent, render } from '@testing-library/react'
import React from 'react'
import { ThemeProvider } from 'styled-components'

import buildConfig from '../../constants/buildConfig'
import SearchInput from '../SearchInput'

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
        value: 'test',
      },
    })
    expect(outerFilterTextChange).toHaveBeenCalledWith('test')
  })
})
