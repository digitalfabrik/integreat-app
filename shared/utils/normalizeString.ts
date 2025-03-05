// eslint-disable-next-line no-control-regex
const nonAsciiRegex = /[^\x00-\x7F\xDF]/g

const normalizeToAscii = (str: string): string => str.normalize('NFKD').replace(nonAsciiRegex, '')

export const normalizeString = (str: string): string => normalizeToAscii(str).toLowerCase().trim()

export default normalizeString
