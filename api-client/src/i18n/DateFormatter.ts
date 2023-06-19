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
    // TODO IGAPP-399: Uncomment again and use locale instead of hardcoded 'en'
    const requestedLocale = 'en'
    const invalidDate = date.setLocale(requestedLocale)
    const defaultDate = date.setLocale(this.defaultLocale)

    const dateWithCorrectLocal = invalidDate.isValid ? invalidDate : defaultDate
    return format ? dateWithCorrectLocal.toFormat(format) : dateWithCorrectLocal.toJSDate().toISOString()
  }
}

export default DateFormatter
