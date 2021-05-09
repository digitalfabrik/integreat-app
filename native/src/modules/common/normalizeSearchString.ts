import normalizeStrings from 'normalize-strings'

const normalizeSearchString = (str: string) => normalizeStrings(str).toLowerCase()

export default normalizeSearchString
