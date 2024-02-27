import { DateTime } from 'luxon'

export const getSlugFromPath = (path: string): string => path.split('/').pop() ?? ''

export const formatDateICal = (date: DateTime): string => date.toFormat("yyyyMMdd'T'HHmm'00'")

export const safeParseInt = (value: string | number | undefined | null): number | undefined => {
  if (value === null || value === undefined) {
    return undefined
  }
  const parsed = Number(value)
  return Number.isSafeInteger(parsed) ? parsed : undefined
}
