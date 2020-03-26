// @flow

import normalizeStrings from 'normalize-strings'

const normalize = (str: string) => normalizeStrings(str).toLowerCase()

export default normalize
