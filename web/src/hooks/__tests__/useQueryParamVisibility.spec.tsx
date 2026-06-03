import { act, renderHook } from '@testing-library/react'
import React from 'react'
import { MemoryRouter } from 'react-router'

import useQueryParamVisibility from '../useQueryParamVisibility'

const createWrapper =
  (initialPath = '/') =>
  ({ children }: { children: React.ReactNode }) => (
    <MemoryRouter initialEntries={[initialPath]}>{children}</MemoryRouter>
  )

describe('useQueryParamVisibility', () => {
  it('should return visible as false when query param is absent', () => {
    const { result } = renderHook(() => useQueryParamVisibility('chat'), { wrapper: createWrapper() })

    expect(result.current.visible).toBe(false)
  })

  it('should return visible as true when query param is set to true', () => {
    const { result } = renderHook(() => useQueryParamVisibility('chat'), { wrapper: createWrapper('/?chat=true') })

    expect(result.current.visible).toBe(true)
  })

  it('should return visible as false when query param is set to false', () => {
    const { result } = renderHook(() => useQueryParamVisibility('chat'), { wrapper: createWrapper('/?chat=false') })

    expect(result.current.visible).toBe(false)
  })

  it('should set visible to true when open is called', () => {
    const { result } = renderHook(() => useQueryParamVisibility('chat'), { wrapper: createWrapper() })

    act(() => result.current.open())

    expect(result.current.visible).toBe(true)
  })

  it('should set visible to false when close is called', () => {
    const { result } = renderHook(() => useQueryParamVisibility('chat'), { wrapper: createWrapper('/?chat=true') })

    act(() => result.current.close())

    expect(result.current.visible).toBe(false)
  })

  it('should return url with query param appended', () => {
    const { result } = renderHook(() => useQueryParamVisibility('chat'), { wrapper: createWrapper() })

    expect(result.current.openUrl('/augsburg/de')).toBe('/augsburg/de?chat=true')
  })

  it('should return null from openUrl when given null', () => {
    const { result } = renderHook(() => useQueryParamVisibility('chat'), { wrapper: createWrapper() })

    expect(result.current.openUrl(null)).toBeNull()
  })
})
