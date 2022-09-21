import { fireEvent } from '@testing-library/react'
import React from 'react'

import { renderWithTheme } from '../../testing/render'
import ScrollingSearchBox from '../ScrollingSearchBox'

describe('ScrollingSearchBox', () => {
  const MockNode = () => <div />

  it('should pass onFilterTextChange and onStickyTopChanged', () => {
    const outerFilterTextChange = jest.fn()
    const outerStickyTopChanged = jest.fn()
    const { getByPlaceholderText } = renderWithTheme(
      <ScrollingSearchBox
        filterText='Test'
        placeholderText='Placeholder'
        onFilterTextChange={outerFilterTextChange}
        onStickyTopChanged={outerStickyTopChanged}>
        <MockNode />
      </ScrollingSearchBox>
    )

    fireEvent.change(getByPlaceholderText('Placeholder'), {
      target: {
        value: 'test',
      },
    })

    expect(outerFilterTextChange).toHaveBeenCalledWith('test')
  })
})
