const nonAsciiRegex = /[^\p{Letter}|\p{Number}]/gu

const normalizeToAscii = (str: string): string => str.normalize('NFKD').replace(nonAsciiRegex, '').replace(/ß/g, 'ss')

export const normalizeString = (str: string): string => normalizeToAscii(str).toLowerCase().trim()

export default normalizeString
