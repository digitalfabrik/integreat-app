import * as React from "react";
import DateFormatter from "api-client/src/i18n/DateFormatter";
const DateFormatterContext = React.createContext<DateFormatter>(new DateFormatter('de'));
export default DateFormatterContext;