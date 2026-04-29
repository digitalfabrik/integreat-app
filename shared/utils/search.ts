import RegionModel from '../api/models/RegionModel'
import { normalizeString } from './normalizeString'

const regionFilter =
  (filterText: string, developerFriendly: boolean) =>
  (regionModel: RegionModel): boolean => {
    const normalizedFilter = normalizeString(filterText)
    if (normalizedFilter === 'wirschaffendas') {
      return !regionModel.live
    }

    const validRegion = regionModel.live || developerFriendly
    const aliases = Object.keys(regionModel.aliases ?? {})
    const matchesFilter = [regionModel.name, ...aliases].some(it => normalizeString(it).includes(normalizedFilter))
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
