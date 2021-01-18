// @flow

import type Moment from 'moment'
import moment from 'moment'

export type FormatFunctionType = (date: Moment, options: {| format?: string |}) => string

class DateFormatter {
  _fallbackFormat: string | void
  _defaultLocale: string

  constructor (fallbackFormat: string | void, defaultLocale: string) {
    this._fallbackFormat = fallbackFormat
    this._defaultLocale = defaultLocale
  }

  format: FormatFunctionType = (date: Moment, options: {| format?: string |}) => {
    const format = options.format || this._fallbackFormat
    // TODO IGAPP-399: Uncomment again and use locale instead of hardcoded 'en'
    // const requestedLocale = defaultLocale
    const requestedLocale = 'en'
    // $FlowFixMe locales is not included in the flow types
    const allLocales = moment.locales()
    const locale = allLocales.includes(requestedLocale) ? requestedLocale : this.defaultLocale
    return date.locale(locale).format(format)
  }

  set defaultLocale (value: string) {
    this._defaultLocale = value
  }

  get defaultLocale (): string {
    return this._defaultLocale
  }
}

export default DateFormatter
