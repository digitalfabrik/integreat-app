import { DateTime } from 'luxon'

export const getSlugFromPath = (path: string): string => path.split('/').pop() ?? ''

export const formatDateICal = (date: DateTime): string => date.toFormat("yyyyMMdd'T'HHmm'00'")

export const capitalizeFirstLetter = (words: string[]): string[] =>
  words.map(word => word.charAt(0).toUpperCase() + word.slice(1))
