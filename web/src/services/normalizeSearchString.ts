import normalizeStrings from 'normalize-strings'

const normalizeSearchString = (str: string): string => normalizeStrings(str).toLowerCase()

export default normalizeSearchString
