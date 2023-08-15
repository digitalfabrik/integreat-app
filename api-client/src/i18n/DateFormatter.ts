import { DateTime } from 'luxon'

export type FormatFunctionType = (
  date: DateTime,
  options: {
    format?: string
  }
) => string
export const ISO8601_FORMAT = undefined

class DateFormatter {
  fallbackFormat?: string = ISO8601_FORMAT
  defaultLocale: string
  constructor(defaultLocale: string, fallbackFormat?: string) {
    this.fallbackFormat = fallbackFormat
    this.defaultLocale = defaultLocale
  }

  format: FormatFunctionType = (
    date: DateTime,
    options: {
      format?: string
    }
  ) => {
    const format = options.format || this.fallbackFormat
    // TODO #1384: the actual locale should be used
    // const requestedLocale = defaultLocale
    return format ? date.toFormat(format) : date.toISO()
  }
}

export default DateFormatter
