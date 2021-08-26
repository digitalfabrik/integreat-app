import moment from 'moment-timezone'
import React from 'react'
import { render, RenderAPI } from '@testing-library/react-native'
import { TimeStamp } from '../TimeStamp'
import { DateFormatter } from 'api-client'
import buildConfig from '../../constants/__mocks__/buildConfig'
import { ThemeProvider } from 'styled-components/native'

jest.mock('react-i18next')

describe('TimeStamp', () => {
  const dateFormatter = new DateFormatter('de')
  const lastUpdate = moment.tz('2020-03-20 17:50:00', 'GMT')

  const renderTimeStamp = (format: string | null, showText: boolean | null): RenderAPI =>
    render(
      <ThemeProvider theme={buildConfig().lightTheme}>
        <TimeStamp
          formatter={dateFormatter}
          lastUpdate={lastUpdate}
          format={format ?? undefined}
          showText={showText ?? undefined}
        />
      </ThemeProvider>
    )

  it('should display last update text and formatted timestamp', () => {
    const { getByText } = renderTimeStamp(null, null)
    const formattedDate = dateFormatter.format(lastUpdate, {
      format: 'LL'
    })
    expect(getByText(/lastUpdate/)).toBeTruthy()
    expect(getByText(formattedDate)).toBeTruthy()
  })
  it('should display last update text and formatted timestamp explicitly', () => {
    const { getByText } = renderTimeStamp(null, true)
    const formattedDate = dateFormatter.format(lastUpdate, {
      format: 'LL'
    })
    expect(getByText(/lastUpdate/)).toBeTruthy()
    expect(getByText(formattedDate)).toBeTruthy()
  })
  it('should only display formatted timestamp', () => {
    const { getByText, queryByText } = renderTimeStamp(null, false)
    const formattedDate = dateFormatter.format(lastUpdate, {
      format: 'LL'
    })
    expect(queryByText(/lastUpdate/)).toBeNull()
    expect(getByText(formattedDate)).toBeTruthy()
  })
  it('should display formatted timestamp with format provided', () => {
    const format = 'LLL'
    const { getByText } = renderTimeStamp(format, false)
    const formattedDate = dateFormatter.format(lastUpdate, {
      format
    })
    expect(getByText(formattedDate)).toBeTruthy()
  })
})
