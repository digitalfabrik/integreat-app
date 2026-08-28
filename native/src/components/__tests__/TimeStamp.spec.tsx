import { RenderAPI } from '@testing-library/react-native'
import { DateTime } from 'luxon'
import React from 'react'

import render from '../../testing/render'
import { TimeStamp } from '../TimeStamp'

describe('TimeStamp', () => {
  const lastUpdate = DateTime.fromISO('2020-03-20T17:50:00+02:00')

  const renderTimeStamp = (format: string | null, showText: boolean | null): RenderAPI =>
    render(<TimeStamp lastUpdate={lastUpdate} format={format ?? undefined} showText={showText ?? undefined} />)

  it('should display last update text and formatted timestamp', () => {
    const { getByText } = renderTimeStamp(null, null)
    expect(getByText(`common:lastUpdate ${lastUpdate.setLocale('en').toFormat('DDD')}`)).toBeTruthy()
  })

  it('should display last update text and formatted timestamp explicitly', () => {
    const { getByText } = renderTimeStamp(null, true)
    expect(getByText(`common:lastUpdate ${lastUpdate.setLocale('en').toFormat('DDD')}`)).toBeTruthy()
  })

  it('should display formatted timestamp with format provided', () => {
    const format = 'DDD t'
    const { getByText } = renderTimeStamp(format, false)
    expect(getByText(lastUpdate.setLocale('en').toFormat('DDD t'))).toBeTruthy()
  })
})
