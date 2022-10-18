import { CityModel, filterSortCities } from '../../index'
import { normalizeString } from '../search'

describe('search', () => {
  describe('normalizeStrings', () => {
    it('should normalize search string', () => {
      expect(normalizeString('Donauwörth')).toBe('donauworth')
      expect(normalizeString('äöUEJJ')).toBe('aouejj')
    })

    it('should trim whitespaces', () => {
      expect(normalizeString('   test  ')).toBe('test')
    })
  })

  describe('filterSortCities', () => {
    const defaultAliases: Record<string, { latitude: number; longitude: number }> = {
      Königsbrunn: {
        latitude: 48.267499,
        longitude: 10.889586,
      },
    }
    const city = ({ prefix = 'Stadt', sortingName = 'Augsburg', live = true, aliases = defaultAliases }) =>
      new CityModel({
        name: [prefix, sortingName].join(' '),
        code: sortingName.toLowerCase(),
        live,
        eventsEnabled: true,
        offersEnabled: true,
        poisEnabled: true,
        localNewsEnabled: false,
        tunewsEnabled: false,
        sortingName,
        prefix,
        aliases,
        latitude: 48.369696,
        longitude: 10.892578,
        boundingBox: [10.7880103, 48.447238, 11.0174493, 48.297834],
      })

    it('should sort by sorting name', () => {
      const cities = [
        city({ sortingName: 'Günzburg' }),
        city({ sortingName: 'Dillingen' }),
        city({ sortingName: 'Augsburg' }),
        city({ sortingName: 'Aichach' }),
      ]
      expect(filterSortCities(cities, '')).toEqual([cities[3], cities[2], cities[1], cities[0]])
    })

    it('should sort by prefix if sorting names are equal', () => {
      const cities = [
        city({ sortingName: 'Dillingen' }),
        city({ sortingName: 'Augsburg', prefix: 'Stadt' }),
        city({ sortingName: 'Augsburg', prefix: '' }),
        city({ sortingName: 'Aichach' }),
        city({ sortingName: 'Augsburg', prefix: 'Landkreis' }),
      ]
      expect(filterSortCities(cities, '')).toEqual([cities[3], cities[2], cities[4], cities[1], cities[0]])
    })

    it('should only keep live and valid cities', () => {
      const cities = [
        city({ sortingName: 'Aichach', live: true }),
        city({ sortingName: 'Augsburg', live: false }),
        city({ sortingName: 'Augsburg', prefix: 'Stadt', live: true }),
        city({ sortingName: 'Dillingen', live: false }),
        city({ sortingName: '', live: true }),
      ]
      expect(filterSortCities(cities, '')).toEqual([cities[0], cities[2]])
    })

    it('should return all valid matching cities if developer friendly', () => {
      const cities = [
        city({ sortingName: 'Aichach', live: true }),
        city({ sortingName: 'Augsburg', live: false }),
        city({ sortingName: 'Augsburg', prefix: 'Stadt', live: true }),
        city({ sortingName: 'Dillingen', live: false }),
        city({ sortingName: '', live: true }),
      ]
      expect(filterSortCities(cities, 'a', true)).toEqual([cities[0], cities[1], cities[2], cities[3]])
    })

    it('should return all non live cities if filter text is wirschaffendas', () => {
      const cities = [
        city({ sortingName: 'Aichach', live: true }),
        city({ sortingName: 'Augsburg', live: false }),
        city({ sortingName: 'Augsburg', prefix: 'Stadt', live: true }),
        city({ sortingName: 'Dillingen', live: false }),
        city({ sortingName: '', live: true }),
      ]
      expect(filterSortCities(cities, 'wirschaffendas', true)).toEqual([cities[1], cities[3]])
    })

    it('should only return live cities with matching names or aliases', () => {
      const cities = [
        city({ sortingName: 'Aichach' }),
        city({ sortingName: 'Aichach', prefix: 'Landkreis', live: false }),
        city({ sortingName: 'Augsburg', prefix: 'Stadt' }),
        city({ sortingName: 'Dachau' }),
        city({
          sortingName: 'Dillingen',
          aliases: {
            Bächingen: {
              latitude: 48.267499,
              longitude: 10.889586,
            },
          },
        }),
        city({
          sortingName: 'Friedberg',
          aliases: {
            Bachern: {
              latitude: 48.267499,
              longitude: 10.889586,
            },
          },
        }),
        city({ sortingName: 'Nürnberg' }),
      ]
      expect(filterSortCities(cities, 'äch')).toEqual([cities[0], cities[3], cities[4], cities[5]])
    })
  })
})
