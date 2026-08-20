import { renderHook, act } from '@testing-library/react'
import { DateTime } from 'luxon'
import React from 'react'
import { MemoryRouter } from 'react-router'

import { EventModelBuilder } from 'shared/api'

import useDateFilter from '../useDateFilter'

const createWrapper =
  (entry = '/') =>
  ({ children }: { children: React.ReactNode }) => <MemoryRouter initialEntries={[entry]}>{children}</MemoryRouter>

const events = new EventModelBuilder('seed', 5, 'augsburg', 'de').build()

describe('useDateFilter', () => {
  it('should read dates from query params', () => {
    const { result } = renderHook(() => useDateFilter(events), {
      wrapper: createWrapper('/?start=2026-08-12&end=2026-10-31'),
    })
    expect(result.current.startDate?.toISODate()).toBe('2026-08-12')
    expect(result.current.endDate?.toISODate()).toBe('2026-10-31')
  })

  it('should return null dates when no params are set', () => {
    const { result } = renderHook(() => useDateFilter(events), {
      wrapper: createWrapper('/'),
    })
    expect(result.current.startDate).toBeNull()
    expect(result.current.endDate).toBeNull()
  })

  it('should set only the startDate param', () => {
    const { result } = renderHook(() => useDateFilter(events), {
      wrapper: createWrapper('/?end=2026-10-31'),
    })
    act(() => result.current.setStartDate(DateTime.fromISO('2026-08-12')))
    expect(result.current.startDate?.toISODate()).toBe('2026-08-12')
    expect(result.current.endDate?.toISODate()).toBe('2026-10-31')
  })

  it('should set only the endDate param', () => {
    const { result } = renderHook(() => useDateFilter(events), {
      wrapper: createWrapper('/?start=2026-08-12'),
    })
    act(() => result.current.setEndDate(DateTime.fromISO('2026-10-31')))
    expect(result.current.endDate?.toISODate()).toBe('2026-10-31')
    expect(result.current.startDate?.toISODate()).toBe('2026-08-12')
  })

  it('should clear only the startDate param and leave endDate', () => {
    const { result } = renderHook(() => useDateFilter(events), {
      wrapper: createWrapper('/?start=2026-08-12&end=2026-10-31'),
    })
    act(() => result.current.setStartDate(null))
    expect(result.current.startDate).toBeNull()
    expect(result.current.endDate?.toISODate()).toBe('2026-10-31')
  })

  it('should clear only the endDate param and leave startDate', () => {
    const { result } = renderHook(() => useDateFilter(events), {
      wrapper: createWrapper('/?start=2026-08-12&end=2026-10-31'),
    })
    act(() => result.current.setEndDate(null))
    expect(result.current.endDate).toBeNull()
    expect(result.current.startDate?.toISODate()).toBe('2026-08-12')
  })

  it('should reset both params', () => {
    const { result } = renderHook(() => useDateFilter(events), {
      wrapper: createWrapper('/?start=2026-08-12&end=2026-10-31'),
    })
    act(() => result.current.resetDates())
    expect(result.current.startDate).toBeNull()
    expect(result.current.endDate).toBeNull()
  })

  it('should set startDateError when start is after end', () => {
    const { result } = renderHook(() => useDateFilter(events), {
      wrapper: createWrapper('/?start=2026-10-31&end=2026-08-12'),
    })
    expect(result.current.startDateError).toBe('shouldBeEarlier')
  })

  it('should not set an error when start is before end', () => {
    const { result } = renderHook(() => useDateFilter(events), {
      wrapper: createWrapper('/?start=2026-08-12&end=2026-10-31'),
    })
    expect(result.current.startDateError).toBeNull()
  })

  it('should return all events when no dates are set', () => {
    const { result } = renderHook(() => useDateFilter(events), {
      wrapper: createWrapper('/'),
    })
    expect(result.current.filteredEvents).toBe(events)
  })

  it('should return no events when start is after end', () => {
    const { result } = renderHook(() => useDateFilter(events), {
      wrapper: createWrapper('/?start=2026-10-31&end=2026-08-12'),
    })
    expect(result.current.filteredEvents).toEqual([])
  })
})
