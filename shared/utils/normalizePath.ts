import normalizePath from 'normalize-path'

import { NOT_FOUND_ROUTE } from '../routes'

const normalize = (value: string): string => {
  try {
    return decodeURIComponent(normalizePath(value)).toLowerCase()
  } catch (_) {
    return NOT_FOUND_ROUTE
  }
}

export default normalize
