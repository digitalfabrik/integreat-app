import { renderHook, act } from '@testing-library/react-native'
import { DateTime } from 'luxon'

import { EventModelBuilder } from 'shared/api'

import useDateFilter from '../useDateFilter'

describe('useDateFilter', () => {
  const events = new EventModelBuilder('seed', 5, 'augsburg', 'de').build()

  it('should set the startDate', () => {
    const { result } = renderHook(() => useDateFilter(events))
    act(() => result.current.setStartDate(DateTime.fromISO('2026-08-12')))
    expect(result.current.startDate?.toISODate()).toBe('2026-08-12')
  })

  it('should set the endDate', () => {
    const { result } = renderHook(() => useDateFilter(events))
    act(() => result.current.setEndDate(DateTime.fromISO('2026-10-31')))
    expect(result.current.endDate?.toISODate()).toBe('2026-10-31')
  })

  it('should clear the startDate without affecting endDate', () => {
    const { result } = renderHook(() => useDateFilter(events))
    act(() => result.current.setStartDate(DateTime.fromISO('2026-08-12')))
    act(() => result.current.setEndDate(DateTime.fromISO('2026-10-31')))
    act(() => result.current.setStartDate(null))
    expect(result.current.startDate).toBeNull()
    expect(result.current.endDate?.toISODate()).toBe('2026-10-31')
  })

  it('should set startDateError when start is after end', () => {
    const { result } = renderHook(() => useDateFilter(events))
    act(() => result.current.setStartDate(DateTime.fromISO('2026-10-31')))
    act(() => result.current.setEndDate(DateTime.fromISO('2026-08-12')))
    expect(result.current.startDateError).toBe('shouldBeEarlier')
  })

  it('should not set an error when start is before end', () => {
    const { result } = renderHook(() => useDateFilter(events))
    act(() => result.current.setStartDate(DateTime.fromISO('2026-08-12')))
    act(() => result.current.setEndDate(DateTime.fromISO('2026-10-31')))
    expect(result.current.startDateError).toBeNull()
  })

  it('should return all events when no dates are set', () => {
    const { result } = renderHook(() => useDateFilter(events))
    expect(result.current.filteredEvents).toBe(events)
  })
})
