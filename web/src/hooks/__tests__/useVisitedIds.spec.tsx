import { act, renderHook } from '@testing-library/react'
import { DateTime } from 'luxon'

import { MAX_DAYS_NEW } from 'shared'

import useVisitedIds from '../useVisitedIds'

describe('useVisitedIds', () => {
  const key = 'visited_ids'

  beforeEach(() => {
    localStorage.clear()
  })

  it('should add visited ids per region', () => {
    const { result } = renderHook(() => useVisitedIds({ key, regionCode: 'augsburg' }))

    act(() => result.current[1]('1'))

    expect(result.current[0]).toEqual(['1'])
    const { result: otherRegionResult } = renderHook(() => useVisitedIds({ key, regionCode: 'muenchen' }))
    expect(otherRegionResult.current[0]).toEqual([])
  })

  it('should remove expired ids of all regions when adding an id', () => {
    const expired = DateTime.now()
      .minus({ days: MAX_DAYS_NEW + 1 })
      .toISO()
    const recent = DateTime.now()
      .minus({ days: MAX_DAYS_NEW - 1 })
      .toISO()
    localStorage.setItem(key, JSON.stringify({ augsburg: { 1: expired, 2: recent }, muenchen: { 3: expired } }))

    const { result } = renderHook(() => useVisitedIds({ key, regionCode: 'augsburg' }))
    expect(result.current[0]).toEqual(['1', '2'])

    act(() => result.current[1]('4'))

    expect(result.current[0]).toEqual(['2', '4'])
    expect(Object.keys(JSON.parse(localStorage.getItem(key) ?? '{}'))).toEqual(['augsburg'])
  })
})
