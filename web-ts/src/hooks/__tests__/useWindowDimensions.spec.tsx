import React from 'react'
import { render } from '@testing-library/react'
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

  it('should correctly set all properties', () => {
    const width = 750
    const height = 400
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: width })
    Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: height })

    const { getByText, queryByText, rerender } = render(<MockComponent />)

    expect(getByText(width, { exact: false })).toBeTruthy()
    expect(getByText(height, { exact: false })).toBeTruthy()
    expect(getByText(false.toString(), { exact: false })).toBeTruthy()
    expect(queryByText(true.toString(), { exact: false })).toBeFalsy()

    const newWidth = 749
    const newHeight = 600
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: newWidth })
    Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: newHeight })
    window.dispatchEvent(new Event('resize'))
    rerender(<MockComponent />)

    expect(getByText(newWidth, { exact: false })).toBeTruthy()
    expect(getByText(newHeight, { exact: false })).toBeTruthy()
    expect(getByText(true.toString(), { exact: false })).toBeTruthy()
    expect(queryByText(false.toString(), { exact: false })).toBeFalsy()
  })
})
