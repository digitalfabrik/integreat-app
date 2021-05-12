import moment, { Moment } from 'moment'

export type FormatFunctionType = (
  date: Moment,
  options: {
    format?: string
  }
) => string
export const ISO8601_FORMAT = 'ISO8601_FORMAT'

class DateFormatter {
  fallbackFormat?: string
  defaultLocale: string

  constructor(defaultLocale: string, fallbackFormat: string | undefined = ISO8601_FORMAT) {
    this.fallbackFormat = fallbackFormat
    this.defaultLocale = defaultLocale
  }

  format: FormatFunctionType = (
    date: Moment,
    options: {
      format?: string
    }
  ) => {
    const format = options.format || this.fallbackFormat
    // TODO IGAPP-399: Uncomment again and use locale instead of hardcoded 'en'
    // const requestedLocale = defaultLocale
    const requestedLocale = 'en'
    const allLocales = moment.locales()
    const locale = allLocales.includes(requestedLocale) ? requestedLocale : this.defaultLocale
    return date.locale(locale).format(format)
  }
}

export default DateFormatter
