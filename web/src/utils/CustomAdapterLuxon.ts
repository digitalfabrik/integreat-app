import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import { DateTime } from 'luxon'

// Since AdapterLuxon doesn't support "throwOnInvalid = true" we have to override parse and getInvalidDate.
// https://mui.com/x/react-date-pickers/adapters-locale/#with-luxon
class CustomAdapterLuxon extends AdapterLuxon {
  parse = (value: string, format: string): DateTime | null => {
    try {
      return DateTime.fromFormat(value, format)
    } catch (_) {
      return null
    }
  }

  getInvalidDate = (): DateTime => DateTime.now()
}

export default CustomAdapterLuxon
