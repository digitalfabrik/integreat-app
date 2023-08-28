import { RenderAPI } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import { DateTime } from 'luxon'
import React from 'react'
import { useTranslation } from 'react-i18next'

import render from '../../testing/render'
import { TimeStamp } from '../TimeStamp'

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({
    t: (key: string) => key,
    i18n: { language: 'en' },
  })),
}))

describe('TimeStamp', () => {
  const lastUpdate = DateTime.fromISO('2020-03-20T17:50:00+02:00')

  const renderTimeStamp = (format: string | null, showText: boolean | null): RenderAPI =>
    render(<TimeStamp lastUpdate={lastUpdate} format={format ?? undefined} showText={showText ?? undefined} />)

  it('should display last update text and formatted timestamp', () => {
    const { getByText } = renderTimeStamp(null, null)
    expect(getByText(/lastUpdate/)).toBeTruthy()
    expect(getByText(lastUpdate.setLocale('en').toFormat('DDD'))).toBeTruthy()
  })

  it('should display last update text and formatted timestamp explicitly', () => {
    const { getByText } = renderTimeStamp(null, true)
    expect(getByText(/lastUpdate/)).toBeTruthy()
    expect(getByText(lastUpdate.setLocale('en').toFormat('DDD'))).toBeTruthy()
  })

  it('should only display formatted timestamp', () => {
    // @ts-expect-error Only mocking relevant props
    mocked(useTranslation).mockImplementationOnce(() => ({ t: (key: string) => key, i18n: { language: 'ar' } }))
    const { getByText, queryByText } = renderTimeStamp(null, false)
    expect(queryByText(/lastUpdate/)).toBeNull()
    expect(getByText(lastUpdate.setLocale('ar').toFormat('DDD'))).toBeTruthy()
  })

  it('should display formatted timestamp with format provided', () => {
    const format = 'DDD t'
    const { getByText } = renderTimeStamp(format, false)
    expect(getByText(lastUpdate.setLocale('en').toFormat('DDD t'))).toBeTruthy()
  })

  it('should display formatted timestamp with format and locale provided', () => {
    // @ts-expect-error Only mocking relevant props
    mocked(useTranslation).mockImplementationOnce(() => ({ t: (key: string) => key, i18n: { language: 'ar' } }))
    const format = 'DDD t'
    const { getByText } = renderTimeStamp(format, false)
    expect(getByText(lastUpdate.setLocale('ar').toFormat('DDD t'))).toBeTruthy()
  })
})
