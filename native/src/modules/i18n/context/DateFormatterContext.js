// @flow

import * as React from 'react'
import DateFormatter from 'api-client/src/i18n/DateFormatter'

const DateFormatterContext = React.createContext<DateFormatter>(
  // undefined corresponds to the ISO_8601 standard
  new DateFormatter(undefined, 'de')
)

export default DateFormatterContext
