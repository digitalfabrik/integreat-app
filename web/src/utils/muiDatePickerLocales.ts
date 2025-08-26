import * as Locales from '@mui/x-date-pickers/locales'
import { PickersInputComponentLocaleText } from '@mui/x-date-pickers/locales'
import { DateTime } from 'luxon'

const localeRegex = /[a-z]{2,3}([A-Z]{2})*/

export const getDatePickerLocaleText = (
  languageCode: string,
): PickersInputComponentLocaleText<DateTime> | undefined => {
  const muiDatePickerLocaleKey = Object.keys(Locales)
    .filter(locale => localeRegex.test(locale))
    .find(locale => locale.includes(languageCode.replace('-', '').toLowerCase())) as keyof typeof Locales | undefined
  const muiDatePickerLocale = muiDatePickerLocaleKey ? Locales[muiDatePickerLocaleKey] : undefined

  // @ts-expect-error the typing is not correct here
  return muiDatePickerLocale?.components.MuiLocalizationProvider.defaultProps.localeText
}
