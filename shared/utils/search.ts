import RegionModel from '../api/models/RegionModel.js'
import { normalizeString } from './normalizeString.js'

export const MATCH_WHITESPACE_AND_DASHES = /[\s-]+/

// Matches with all three string start cases, for ex. Landkreis Breisgau-Hochschwarzwald
const matchesWordStart = (text: string, normalizedFilter: string): boolean =>
  normalizeString(text)
    .split(MATCH_WHITESPACE_AND_DASHES)
    .some(word => word.startsWith(normalizedFilter))

const regionFilter =
  (filterText: string, developerFriendly: boolean) =>
  (regionModel: RegionModel): boolean => {
    const normalizedFilter = normalizeString(filterText)
    if (normalizedFilter === 'wirschaffendas') {
      return !regionModel.live
    }

    const validRegion = regionModel.live || developerFriendly
    const aliases = Object.keys(regionModel.aliases ?? {})
    const matchesFilter =
      matchesWordStart(regionModel.name, normalizedFilter) ||
      aliases.some(alias => matchesWordStart(alias, normalizedFilter))
    return validRegion && matchesFilter
  }

const safeLocaleCompare = (a: string | null | undefined, b: string | null | undefined): number =>
  (a ?? '').localeCompare(b ?? '')

const regionSort = (a: RegionModel, b: RegionModel): number =>
  safeLocaleCompare(a.sortingName, b.sortingName) || safeLocaleCompare(a.prefix, b.prefix)

export const filterSortRegions = (
  regions: RegionModel[],
  filterText: string,
  developerFriendly = false,
): RegionModel[] => regions.filter(regionFilter(filterText, developerFriendly)).sort(regionSort)

export const getMatchingAliases = (aliases: Record<string, unknown> | null, filterText: string): string[] => {
  if (!aliases) {
    return []
  }

  const normalizedFilter = normalizeString(filterText)

  return Object.keys(aliases).filter(alias => matchesWordStart(alias, normalizedFilter))
}

const getLanguageNames = (languageCode: string): Intl.DisplayNames | null => {
  try {
    return new Intl.DisplayNames([languageCode], { type: 'language' })
  } catch (_) {
    return null
  }
}

export const filterLanguages = <T extends { name: string; code: string }>(
  languages: T[],
  query: string,
  userLanguageCode: string,
  sourceLanguageCode: string,
): T[] => {
  const normalizedQuery = normalizeString(query)
  if (normalizedQuery.length === 0) {
    return languages
  }

  const userDisplayNames = getLanguageNames(userLanguageCode)
  const sourceDisplayNames = getLanguageNames(sourceLanguageCode)

  return languages.filter(
    language =>
      normalizeString(language.name).includes(normalizedQuery) ||
      normalizeString(userDisplayNames?.of(language.code) ?? '').includes(normalizedQuery) ||
      normalizeString(sourceDisplayNames?.of(language.code) ?? '').includes(normalizedQuery),
  )
}
