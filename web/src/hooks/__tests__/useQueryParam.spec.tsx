import { act, renderHook } from '@testing-library/react'
import React, { ReactNode } from 'react'
import { MemoryRouter, useLocation } from 'react-router'

import { QueryParams } from 'shared'

import useQueryParam from '../useQueryParam'

const createWrapper =
  (initialPath = '/') =>
  ({ children }: { children: ReactNode }) => <MemoryRouter initialEntries={[initialPath]}>{children}</MemoryRouter>

const renderUseQueryParam = <T extends keyof QueryParams>(key: T, initialPath?: string) =>
  renderHook(
    () => {
      const [value, setValue] = useQueryParam(key)
      const { search } = useLocation()
      return { value, setValue, search }
    },
    { wrapper: createWrapper(initialPath) },
  ).result

describe('useQueryParam', () => {
  it('should return undefined when the query param is absent', () => {
    const result = renderUseQueryParam('chat')
    expect(result.current.value).toBeUndefined()
  })

  it('should parse the query param value from the URL', () => {
    const result = renderUseQueryParam('chat', '/?chat=true')
    expect(result.current.value).toBe(true)
  })

  it('should return undefined when the query param has an invalid value', () => {
    const result = renderUseQueryParam('chat', '/?chat=false')
    expect(result.current.value).toBeUndefined()
  })

  it('should write the value to the URL when setValue is called', () => {
    const result = renderUseQueryParam('chat')
    act(() => result.current.setValue(true))
    expect(result.current.search).toBe('?chat=true')
    expect(result.current.value).toBe(true)
  })

  it('should remove the query param when setValue is called with undefined', () => {
    const result = renderUseQueryParam('chat', '/?chat=true')
    act(() => result.current.setValue(undefined))
    expect(result.current.search).toBe('')
    expect(result.current.value).toBeUndefined()
  })

  it('should preserve other query params when updating one', () => {
    const result = renderUseQueryParam('chat', '/?theme=contrast')
    act(() => result.current.setValue(true))
    expect(result.current.search).toContain('theme=contrast')
    expect(result.current.search).toContain('chat=true')
  })
})
