import { act, renderHook, waitFor } from '@testing-library/react'

import useDimensions from '../useDimensions'

jest.mock('react-i18next')

describe('useDimensions', () => {
  const { innerWidth, innerHeight } = window

  afterAll(() => {
    Object.defineProperty(window, 'innerWidth', { value: innerWidth })
    Object.defineProperty(window, 'innerHeight', { value: innerHeight })
  })

  it('should correctly update properties', () => {
    const width = 841
    const height = 800
    Object.defineProperty(window, 'innerWidth', { value: width })
    Object.defineProperty(window, 'innerHeight', { value: height })

    const {
      result: { current },
    } = renderHook(useDimensions)

    expect(current.window.width).toBe(841)
    expect(current.window.height).toBe(800)
    expect(current.desktop).toBe(true)
    expect(current.mobile).toBe(false)
    expect(current.small).toBe(false)
    expect(current.medium).toBe(false)
    expect(current.large).toBe(true)
    expect(current.xlarge).toBe(false)

    const newWidth = 768
    const newHeight = 600

    act(() => {
      Object.defineProperty(window, 'innerWidth', { value: newWidth })
      Object.defineProperty(window, 'innerHeight', { value: newHeight })
      window.dispatchEvent(new Event('resize'))
    })

    waitFor(() => expect(current.window.width).toBe(768))
    waitFor(() => expect(current.window.height).toBe(600))
    waitFor(() => expect(current.desktop).toBe(false))
    waitFor(() => expect(current.mobile).toBe(true))
    waitFor(() => expect(current.small).toBe(false))
    waitFor(() => expect(current.medium).toBe(true))
    waitFor(() => expect(current.large).toBe(false))
    waitFor(() => expect(current.xlarge).toBe(false))
  })

  it('should correctly set values for small screens', () => {
    const width = 450
    const height = 800
    Object.defineProperty(window, 'innerWidth', { value: width })
    Object.defineProperty(window, 'innerHeight', { value: height })

    const {
      result: { current },
    } = renderHook(useDimensions)

    expect(current.window.width).toBe(450)
    expect(current.window.height).toBe(800)
    expect(current.desktop).toBe(false)
    expect(current.mobile).toBe(true)
    expect(current.small).toBe(true)
    expect(current.medium).toBe(false)
    expect(current.large).toBe(false)
    expect(current.xlarge).toBe(false)
  })

  it('should correctly set values for xlarge screens', () => {
    const width = 1920
    const height = 800
    Object.defineProperty(window, 'innerWidth', { value: width })
    Object.defineProperty(window, 'innerHeight', { value: height })

    const {
      result: { current },
    } = renderHook(useDimensions)

    expect(current.window.width).toBe(1920)
    expect(current.window.height).toBe(800)
    expect(current.desktop).toBe(true)
    expect(current.mobile).toBe(false)
    expect(current.small).toBe(false)
    expect(current.medium).toBe(false)
    expect(current.large).toBe(false)
    expect(current.xlarge).toBe(true)
  })
})
