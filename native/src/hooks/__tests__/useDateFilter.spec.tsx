import { useNavigation, useRoute } from '@react-navigation/native'
import { renderHook, act } from '@testing-library/react-native'
import { DateTime } from 'luxon'

import { EventModelBuilder } from 'shared/api'

import createNavigationPropMock from '../../testing/createNavigationPropMock'
import useDateFilter from '../useDateFilter'

jest.mock('@react-navigation/native')

describe('useDateFilter', () => {
  const { mocked } = jest
  const events = new EventModelBuilder('seed', 5, 'augsburg', 'de').build()

  const setupUseDateFilter = () => {
    let params: { startDate?: DateTime; endDate?: DateTime } = {}
    const rerenderRef = { current: () => {} }
    const navigation = {
      ...createNavigationPropMock(),
      setParams: (updates: Partial<typeof params>) => {
        params = { ...params, ...updates }
        rerenderRef.current()
      },
    }
    mocked(useNavigation).mockReturnValue(navigation as never)
    mocked(useRoute).mockImplementation(() => ({ params }) as never)
    const hook = renderHook(() => useDateFilter(events))
    rerenderRef.current = () => hook.rerender(undefined)
    return hook
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should set the startDate', () => {
    const { result } = setupUseDateFilter()
    act(() => result.current.setStartDate(DateTime.fromISO('2026-08-12')))
    expect(result.current.startDate?.toISODate()).toBe('2026-08-12')
  })

  it('should set the endDate', () => {
    const { result } = setupUseDateFilter()
    act(() => result.current.setEndDate(DateTime.fromISO('2026-10-31')))
    expect(result.current.endDate?.toISODate()).toBe('2026-10-31')
  })

  it('should clear the startDate without affecting endDate', () => {
    const { result } = setupUseDateFilter()
    act(() => result.current.setStartDate(DateTime.fromISO('2026-08-12')))
    act(() => result.current.setEndDate(DateTime.fromISO('2026-10-31')))
    act(() => result.current.setStartDate(null))
    expect(result.current.startDate).toBeNull()
    expect(result.current.endDate?.toISODate()).toBe('2026-10-31')
  })

  it('should set startDateError when start is after end', () => {
    const { result } = setupUseDateFilter()
    act(() => result.current.setStartDate(DateTime.fromISO('2026-10-31')))
    act(() => result.current.setEndDate(DateTime.fromISO('2026-08-12')))
    expect(result.current.startDateError).toBe('shouldBeEarlier')
  })

  it('should not set an error when start is before end', () => {
    const { result } = setupUseDateFilter()
    act(() => result.current.setStartDate(DateTime.fromISO('2026-08-12')))
    act(() => result.current.setEndDate(DateTime.fromISO('2026-10-31')))
    expect(result.current.startDateError).toBeNull()
  })

  it('should return all events when no dates are set', () => {
    const { result } = setupUseDateFilter()
    expect(result.current.filteredEvents).toBe(events)
  })
})
