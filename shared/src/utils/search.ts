import RegionModel from '../api/models/RegionModel.ts'
import { BESCHEID_CHECK_ROUTE } from '../routes/index.ts'
import { normalizeString } from './normalizeString.ts'

export const MATCH_WHITESPACE_AND_DASHES = /[\s-]+/

// Matches with all three string start cases, for ex. Landkreis Breisgau-Hochschwarzwald
const matchesWordStart = (text: string, normalizedFilter: string): boolean => {
  const normalizedSearchWords = normalizedFilter.split(MATCH_WHITESPACE_AND_DASHES)
  const normalizedTextWords = normalizeString(text).split(MATCH_WHITESPACE_AND_DASHES)
  return normalizedSearchWords.every(searchWord =>
    normalizedTextWords.some(textWord => textWord.startsWith(searchWord)),
  )
}

const safeLocaleCompare = (a: string | null | undefined, b: string | null | undefined): number =>
  (a ?? '').localeCompare(b ?? '')

const regionSort = (a: RegionModel, b: RegionModel): number =>
  safeLocaleCompare(a.sortingName, b.sortingName) || safeLocaleCompare(a.prefix, b.prefix)

export const getMatchingAliases = (aliases: Record<string, unknown> | null, filterText: string): string[] => {
  if (!aliases) {
    return []
  }

  const normalizedFilter = normalizeString(filterText)

  return Object.keys(aliases).filter(alias => matchesWordStart(alias, normalizedFilter))
}

// Ordered by relevance: Exact, word start, contains (without prefix) and alias.
const matchLevels = (normalizedFilter: string): ((region: RegionModel) => boolean)[] => [
  region =>
    normalizeString(region.name) === normalizedFilter || normalizeString(region.sortingName) === normalizedFilter,
  region => matchesWordStart(region.name, normalizedFilter),
  region => normalizeString(region.sortingName).includes(normalizedFilter),
  region => getMatchingAliases(region.aliases, normalizedFilter).length > 0,
]

export const filterSortRegions = (
  regions: RegionModel[],
  filterText: string,
  developerFriendly = false,
): RegionModel[] => {
  const normalizedFilter = normalizeString(filterText)
  if (normalizedFilter === 'wirschaffendas') {
    return regions.filter(region => !region.live).sort(regionSort)
  }

  const levels = matchLevels(normalizedFilter)
  return (
    regions
      // The Bescheid-Check feature is implemented on top of a region which is live for SEO-purposes but should not be visible in the region list
      .filter(region => (region.live && region.code !== BESCHEID_CHECK_ROUTE) || developerFriendly)
      .map(region => ({ region, level: levels.findIndex(matches => matches(region)) }))
      .filter(({ level }) => level !== -1)
      .sort((a, b) => a.level - b.level || regionSort(a.region, b.region))
      .map(({ region }) => region)
  )
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
