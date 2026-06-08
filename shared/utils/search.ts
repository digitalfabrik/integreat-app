import RegionModel from '../api/models/RegionModel.js'
import { normalizeString } from './normalizeString.js'

const regionFilter =
  (filterText: string, developerFriendly: boolean) =>
  (regionModel: RegionModel): boolean => {
    const normalizedFilter = normalizeString(filterText)
    if (normalizedFilter === 'wirschaffendas') {
      return !regionModel.live
    }

    const validRegion = regionModel.live || developerFriendly

    // Matches with all three string start cases, for ex. Landkreis Breisgau-Hochschwarzwald
    const matchesWordStart = (region: string) =>
      normalizeString(region)
        .split(/[\s-]+/)
        .some(word => word.startsWith(normalizedFilter))
    const aliases = Object.keys(regionModel.aliases ?? {})
    const matchesFilter = matchesWordStart(regionModel.name) || aliases.some(matchesWordStart)
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
