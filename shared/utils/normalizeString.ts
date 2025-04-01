// string.normalize('NFKD') decomposites special characters for normalization
// The resulting mark characters have to be stripped for proper normalization
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize
const normalize = (str: string): string =>
  str
    .normalize('NFKD')
    .replace(/\p{Mark}/gu, '')
    .replace(/ß/g, 'ss')

export const normalizeString = (str: string): string => normalize(str).toLowerCase().trim()

export default normalizeString
