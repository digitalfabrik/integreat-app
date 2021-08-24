import moment from 'moment-timezone'
import React from 'react'
import { render } from '@testing-library/react-native'
import { TimeStamp } from '../TimeStamp'
import { DateFormatter } from 'api-client'
import buildConfig from '../../constants/__mocks__/buildConfig'

jest.mock('react-i18next')

describe('TimeStamp', () => {
  it('should display last update text and formatted timestamp', () => {
    const dateFormatter = new DateFormatter('de')
    const lastUpdate = moment.tz('2020-03-20 17:50:00', 'GMT')
    const { getByText } = render(
      <TimeStamp formatter={dateFormatter} lastUpdate={lastUpdate} theme={buildConfig().lightTheme} />
    )
    const formattedDate = dateFormatter.format(lastUpdate, {
      format: 'LL'
    })
    expect(getByText(/lastUpdate/)).toBeTruthy()
    expect(getByText(formattedDate)).toBeTruthy()
  })
  it('should display last update text and formatted timestamp explicitly', () => {
    const dateFormatter = new DateFormatter('de')
    const lastUpdate = moment.tz('2020-03-20 17:50:00', 'GMT')
    const { getByText } = render(
      <TimeStamp formatter={dateFormatter} theme={buildConfig().lightTheme} lastUpdate={lastUpdate} showText={true} />
    )
    const formattedDate = dateFormatter.format(lastUpdate, {
      format: 'LL'
    })
    expect(getByText(/lastUpdate/)).toBeTruthy()
    expect(getByText(formattedDate)).toBeTruthy()
  })
  it('should only display formatted timestamp', () => {
    const dateFormatter = new DateFormatter('de')
    const lastUpdate = moment.tz('2020-03-20 17:50:00', 'GMT')
    const { getByText, queryByText } = render(
      <TimeStamp formatter={dateFormatter} theme={buildConfig().lightTheme} lastUpdate={lastUpdate} showText={false} />
    )
    const formattedDate = dateFormatter.format(lastUpdate, {
      format: 'LL'
    })
    expect(queryByText(/lastUpdate/)).toBeNull()
    expect(getByText(formattedDate)).toBeTruthy()
  })
  it('should display formatted timestamp with format provided', () => {
    const dateFormatter = new DateFormatter('de')
    const format = 'LLL'
    const lastUpdate = moment.tz('2020-03-20 17:50:00', 'GMT')
    const { getByText } = render(
      <TimeStamp
        formatter={dateFormatter}
        theme={buildConfig().lightTheme}
        lastUpdate={lastUpdate}
        format={format}
        showText={false}
      />
    )
    const formattedDate = dateFormatter.format(lastUpdate, {
      format
    })
    expect(getByText(formattedDate)).toBeTruthy()
  })
})
