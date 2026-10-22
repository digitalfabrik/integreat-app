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

const regionFilter =
  (filterText: string, developerFriendly: boolean) =>
  (regionModel: RegionModel): boolean => {
    const normalizedFilter = normalizeString(filterText)
    if (normalizedFilter === 'wirschaffendas') {
      return !regionModel.live
    }

    // The Bescheid-Check feature is implemented on top of a region which is live for SEO-purposes but should not be visible in the region list
    const visible = (regionModel.live && regionModel.code !== BESCHEID_CHECK_ROUTE) || developerFriendly
    const aliases = Object.keys(regionModel.aliases ?? {})
    const matchesFilter =
      matchesWordStart(regionModel.name, normalizedFilter) ||
      aliases.some(alias => matchesWordStart(alias, normalizedFilter))
    return visible && matchesFilter
  }

const safeLocaleCompare = (a: string | null | undefined, b: string | null | undefined): number =>
  (a ?? '').localeCompare(b ?? '')

const regionSort = (a: RegionModel, b: RegionModel): number =>
  safeLocaleCompare(a.sortingName, b.sortingName) || safeLocaleCompare(a.prefix, b.prefix)

const MatchPriority = {
  ExactName: 0,
  NameWordStart: 1,
  NameContains: 2,
  AliasOnly: 3,
}

const getMatchPriority = (regionModel: RegionModel, normalizedFilter: string): number => {
  const normalizedName = normalizeString(regionModel.name)
  const normalizedSortingName = normalizeString(regionModel.sortingName)

  if (normalizedName === normalizedFilter || normalizedSortingName === normalizedFilter) {
    return MatchPriority.ExactName
  }
  if (matchesWordStart(regionModel.name, normalizedFilter)) {
    return MatchPriority.NameWordStart
  }
  if (normalizedName.includes(normalizedFilter)) {
    return MatchPriority.NameContains
  }
  return MatchPriority.AliasOnly
}

const relevanceSort =
  (normalizedFilter: string) =>
  (a: RegionModel, b: RegionModel): number =>
    getMatchPriority(a, normalizedFilter) - getMatchPriority(b, normalizedFilter) || regionSort(a, b)

export const filterSortRegions = (
  regions: RegionModel[],
  filterText: string,
  developerFriendly = false,
): RegionModel[] => {
  const normalizedFilter = normalizeString(filterText)
  return regions.filter(regionFilter(filterText, developerFriendly)).sort(relevanceSort(normalizedFilter))
}

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
