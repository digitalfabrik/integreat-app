import { act, fireEvent, render, renderHook } from '@testing-library/react'
import React from 'react'
import { MemoryRouter, useSearchParams } from 'react-router'

import useQueryParam from '../useQueryParam'

const createWrapper =
  (initialPath = '/') =>
  ({ children }: { children: React.ReactNode }) => (
    <MemoryRouter initialEntries={[initialPath]}>{children}</MemoryRouter>
  )

const MockComponent = () => {
  const { isSet, unset } = useQueryParam('chat')
  const [, setSearchParams] = useSearchParams()
  return (
    <>
      <span>{isSet ? 'visible' : 'hidden'}</span>
      <button
        type='button'
        onClick={() => {
          unset()
          setSearchParams({ chat: 'true' })
        }}>
        closeAndReopen
      </button>
    </>
  )
}

describe('useQueryParamVisibility', () => {
  it('should return visible as false when query param is absent', () => {
    const { result } = renderHook(() => useQueryParam('chat'), { wrapper: createWrapper() })

    expect(result.current.isSet).toBe(false)
  })

  it('should return visible as true when query param is set to true', () => {
    const { result } = renderHook(() => useQueryParam('chat'), { wrapper: createWrapper('/?chat=true') })

    expect(result.current.isSet).toBe(true)
  })

  it('should return visible as false when query param is set to false', () => {
    const { result } = renderHook(() => useQueryParam('chat'), { wrapper: createWrapper('/?chat=false') })

    expect(result.current.isSet).toBe(false)
  })

  it('should set visible to true when open is called', () => {
    const { result } = renderHook(() => useQueryParam('chat'), { wrapper: createWrapper() })

    act(() => result.current.set())

    expect(result.current.isSet).toBe(true)
  })

  it('should set visible to false when close is called', () => {
    const { result } = renderHook(() => useQueryParam('chat'), { wrapper: createWrapper('/?chat=true') })

    act(() => result.current.unset())

    expect(result.current.isSet).toBe(false)
  })

  it('should stay visible when the same query param is set again after closing', () => {
    const { getByText } = render(<MockComponent />, { wrapper: createWrapper('/?chat=true') })

    fireEvent.click(getByText('closeAndReopen'))

    expect(getByText('visible')).toBeTruthy()
  })

  it('should return url with query param appended', () => {
    const { result } = renderHook(() => useQueryParam('chat'), { wrapper: createWrapper() })

    expect(result.current.url('/augsburg/de')).toBe('/augsburg/de?chat=true')
  })

  it('should return null from openUrl when given null', () => {
    const { result } = renderHook(() => useQueryParam('chat'), { wrapper: createWrapper() })

    expect(result.current.url(null)).toBeNull()
  })
})
