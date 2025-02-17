import { act } from '@testing-library/react'
import React from 'react'

import { renderWithTheme } from '../../testing/render'
import useDetectBottomWhileScroll from '../useDetectBottomWhileScroll'

describe('useDetectBottomWhileScroll', () => {
  const TestComponent = () => {
    const { isReachedBottom } = useDetectBottomWhileScroll()
    return <div data-testid='bottom-status'>{isReachedBottom.toString()}</div>
  }

  it('should initially not be at bottom when not scrolled to the end', () => {
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true })
    Object.defineProperty(window, 'innerHeight', { value: 600, configurable: true })
    Object.defineProperty(document.body, 'offsetHeight', { value: 1200, configurable: true })

    const { getByTestId } = renderWithTheme(<TestComponent />)

    act(() => {
      window.dispatchEvent(new Event('scroll'))
    })

    expect(getByTestId('bottom-status').textContent).toBe('false')
  })

  it('should detect bottom when scrolled to the end', () => {
    // window.innerHeight + window.scrollY equals document.body.offsetHeight.
    Object.defineProperty(window, 'scrollY', { value: 600, configurable: true })
    Object.defineProperty(window, 'innerHeight', { value: 600, configurable: true })
    Object.defineProperty(document.body, 'offsetHeight', { value: 1200, configurable: true })

    const { getByTestId } = renderWithTheme(<TestComponent />)

    act(() => {
      window.dispatchEvent(new Event('scroll'))
    })

    expect(getByTestId('bottom-status').textContent).toBe('true')
  })

  it('should update state when scrolling to bottom', () => {
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true })
    Object.defineProperty(window, 'innerHeight', { value: 600, configurable: true })
    Object.defineProperty(document.body, 'offsetHeight', { value: 1200, configurable: true })

    const { getByTestId } = renderWithTheme(<TestComponent />)

    act(() => {
      window.dispatchEvent(new Event('scroll'))
    })

    expect(getByTestId('bottom-status').textContent).toBe('false')

    // scrolling to the bottom.
    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 600, configurable: true })
      window.dispatchEvent(new Event('scroll'))
    })

    expect(getByTestId('bottom-status').textContent).toBe('true')
  })
})
