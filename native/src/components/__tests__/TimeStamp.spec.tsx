import { RenderResult } from '@testing-library/react-native'
import { DateTime } from 'luxon'
import React from 'react'

import render from '../../testing/render'
import { TimeStamp } from '../TimeStamp'

describe('TimeStamp', () => {
  const lastUpdate = DateTime.fromISO('2020-03-20T17:50:00+02:00')

  const renderTimeStamp = (format: string | null, showText: boolean | null): Promise<RenderResult> =>
    render(<TimeStamp lastUpdate={lastUpdate} format={format ?? undefined} showText={showText ?? undefined} />)

  it('should display last update text and formatted timestamp', async () => {
    const { getByText } = await renderTimeStamp(null, null)
    expect(getByText(`common:state.updatedAt ${lastUpdate.setLocale('en').toFormat('DDD')}`)).toBeTruthy()
  })

  it('should display last update text and formatted timestamp explicitly', async () => {
    const { getByText } = await renderTimeStamp(null, true)
    expect(getByText(`common:state.updatedAt ${lastUpdate.setLocale('en').toFormat('DDD')}`)).toBeTruthy()
  })

  it('should display formatted timestamp with format provided', async () => {
    const format = 'DDD t'
    const { getByText } = await renderTimeStamp(format, false)
    expect(getByText(lastUpdate.setLocale('en').toFormat('DDD t'))).toBeTruthy()
  })
})
