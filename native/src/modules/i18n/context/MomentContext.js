// @flow

import * as React from 'react'
import type Moment from 'moment'
import moment from 'moment'

export type MomentFormatterType = (date: Moment, options: {| format?: string, locale?: string |}) => string

export const createMomentFormatter = (fallbackFormat: () => string | void, fallbackLocale: () => string) => {
  return (date: Moment, options: {| format?: string, locale?: string |}) => {
    const format = options.format || fallbackFormat()
    // $FlowFixMe locales is not included in the flow types
    const allLocales = moment.locales()
    const locale = options.locale && allLocales.includes(options.locale) ? options.locale : fallbackLocale()
    return date.locale(locale).format(format)
  }
}

const MomentContext = React.createContext<MomentFormatterType>(
  // undefined corresponds to the ISO_8601 standard
  createMomentFormatter(() => undefined, () => 'en_US')
)

export default MomentContext
