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

  const userLanguageNames = new Intl.DisplayNames([userLanguageCode], { type: 'language' })
  const sourceLanguageNames = new Intl.DisplayNames([sourceLanguageCode], { type: 'language' })

  return languages.filter(
    language =>
      normalizeString(language.name).includes(normalizedQuery) ||
      normalizeString(userLanguageNames.of(language.code) ?? '').includes(normalizedQuery) ||
      normalizeString(sourceLanguageNames.of(language.code) ?? '').includes(normalizedQuery),
  )
}
