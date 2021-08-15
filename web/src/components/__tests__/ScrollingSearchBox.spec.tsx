import React from 'react'
import ScrollingSearchBox from '../ScrollingSearchBox'
import { ThemeProvider } from 'styled-components'
import buildConfig from '../../constants/buildConfig'
import { fireEvent, render } from '@testing-library/react'

describe('ScrollingSearchBox', () => {
  const MockNode = () => <div />
  const theme = buildConfig().lightTheme

  it('should pass onFilterTextChange and onStickyTopChanged', () => {
    const outerFilterTextChange = jest.fn()
    const outerStickyTopChanged = jest.fn()
    const { getByPlaceholderText } = render(
      <ThemeProvider theme={theme}>
        <ScrollingSearchBox
          filterText='Test'
          placeholderText='Placeholder'
          onFilterTextChange={outerFilterTextChange}
          onStickyTopChanged={outerStickyTopChanged}>
          <MockNode />
        </ScrollingSearchBox>
      </ThemeProvider>
    )

    fireEvent.change(getByPlaceholderText('Placeholder'), {
      target: {
        value: 'test'
      }
    })

    expect(outerFilterTextChange).toHaveBeenCalledWith('test')
  })
})
