import CityModel from '../api/models/CityModel'
import { normalizeString } from './normalizeString'

const cityFilter =
  (filterText: string, developerFriendly: boolean) =>
  (cityModel: CityModel): boolean => {
    const normalizedFilter = normalizeString(filterText)
    if (normalizedFilter === 'wirschaffendas') {
      return !cityModel.live
    }

    const validCity = cityModel.live || developerFriendly
    const aliases = Object.keys(cityModel.aliases ?? {})
    const matchesFilter = [cityModel.name, ...aliases].some(it => normalizeString(it).includes(normalizedFilter))
    return validCity && matchesFilter
  }

const safeLocaleCompare = (a: string | null | undefined, b: string | null | undefined): number =>
  (a ?? '').localeCompare(b ?? '')

const citySort = (a: CityModel, b: CityModel): number =>
  safeLocaleCompare(a.sortingName, b.sortingName) || safeLocaleCompare(a.prefix, b.prefix)

export const filterSortCities = (cities: CityModel[], filterText: string, developerFriendly = false): CityModel[] =>
  cities.filter(cityFilter(filterText, developerFriendly)).sort(citySort)
