import { act, renderHook } from '@testing-library/react-native'
import { DateTime } from 'luxon'
import React, { ReactNode, useState } from 'react'

import { MAX_DAYS_NEW } from 'shared'

import TestingAppContext from '../../testing/TestingAppContext'
import { defaultSettings, SettingsType } from '../../utils/AppSettings'
import useVisitedIds from '../useVisitedIds'

jest.useFakeTimers({ now: new Date('2023-10-02T05:23:57.443+02:00') })

describe('useVisitedIds', () => {
  const today = DateTime.now().toISODate()

  const renderVisitedIds = (regionCode: string, visitedEventIds: SettingsType['visitedEventIds']) => {
    const Wrapper = ({ children }: { children: ReactNode }) => {
      const [settings, setSettings] = useState<SettingsType>({ ...defaultSettings, visitedEventIds })
      const updateSettings = (update: Partial<SettingsType> | ((old: SettingsType) => Partial<SettingsType>)) =>
        setSettings(old => ({ ...old, ...(typeof update === 'function' ? update(old) : update) }))
      return (
        <TestingAppContext settings={settings} updateSettings={updateSettings}>
          {children}
        </TestingAppContext>
      )
    }
    return renderHook(() => useVisitedIds({ key: 'visitedEventIds', regionCode }), { wrapper: Wrapper })
  }

  it('should return visited ids of the region', () => {
    const { result } = renderVisitedIds('augsburg', { augsburg: { 1: today }, muenchen: { 2: today } })

    expect(result.current[0]).toEqual(['1'])
  })

  it('should add visited ids and remove expired ones', () => {
    const expired = DateTime.now()
      .minus({ days: MAX_DAYS_NEW + 1 })
      .toISODate()
    const { result } = renderVisitedIds('augsburg', { augsburg: { 1: expired, 2: today } })

    act(() => result.current[1]('3'))

    expect(result.current[0]).toEqual(['2', '3'])
  })
})
