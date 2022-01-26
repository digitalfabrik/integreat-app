import { act, render } from '@testing-library/react'
import React from 'react'

import useWindowDimensions from '../useWindowDimensions'

describe('useWindowDimensions', () => {
  const MockComponent = () => {
    const { width, height, viewportSmall } = useWindowDimensions()
    return (
      <div>
        {width} {height} {viewportSmall.toString()}
      </div>
    )
  }
  const { innerWidth, innerHeight } = window

  afterAll(() => {
    Object.defineProperty(window, 'innerWidth', { value: innerWidth })
    Object.defineProperty(window, 'innerHeight', { value: innerHeight })
  })

  it('should correctly set all properties', () => {
    const width = 750
    const height = 400
    Object.defineProperty(window, 'innerWidth', { value: width })
    Object.defineProperty(window, 'innerHeight', { value: height })

    const { getByText, queryByText } = render(<MockComponent />)

    expect(getByText(width, { exact: false })).toBeTruthy()
    expect(getByText(height, { exact: false })).toBeTruthy()
    expect(getByText(false.toString(), { exact: false })).toBeTruthy()
    expect(queryByText(true.toString(), { exact: false })).toBeFalsy()

    const newWidth = 749
    const newHeight = 600
    act(() => {
      Object.defineProperty(window, 'innerWidth', { value: newWidth })
      Object.defineProperty(window, 'innerHeight', { value: newHeight })
      window.dispatchEvent(new Event('resize'))
    })

    expect(getByText(newWidth, { exact: false })).toBeTruthy()
    expect(getByText(newHeight, { exact: false })).toBeTruthy()
    expect(getByText(true.toString(), { exact: false })).toBeTruthy()
    expect(queryByText(false.toString(), { exact: false })).toBeFalsy()
  })
})
