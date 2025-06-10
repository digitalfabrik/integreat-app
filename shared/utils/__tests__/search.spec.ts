import { DateTime } from 'luxon'

import { filterRedundantFallbackLanguageResults, filterSortCities } from '../..'
import LanguageModelBuilder from '../../api/endpoints/testing/LanguageModelBuilder'
import CityModel from '../../api/models/CityModel'
import ExtendedPageModel from '../../api/models/ExtendedPageModel'

describe('search', () => {
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
        languages: new LanguageModelBuilder(2).build(),
        eventsEnabled: true,
        poisEnabled: true,
        localNewsEnabled: false,
        tunewsEnabled: false,
        sortingName,
        prefix,
        aliases,
        latitude: 48.369696,
        longitude: 10.892578,
        boundingBox: [10.7880103, 48.447238, 11.0174493, 48.297834],
        chatEnabled: false,
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
      ]
      expect(filterSortCities(cities, '')).toEqual([cities[0], cities[2]])
    })

    it('should return all valid matching cities if developer friendly', () => {
      const cities = [
        city({ sortingName: 'Aichach', live: true }),
        city({ sortingName: 'Augsburg', live: false }),
        city({ sortingName: 'Augsburg', prefix: 'Stadt', live: true }),
        city({ sortingName: 'Dillingen', live: false }),
      ]
      expect(filterSortCities(cities, 'a', true)).toEqual([cities[0], cities[1], cities[2], cities[3]])
    })

    it('should return all non live cities if filter text is wirschaffendas', () => {
      const cities = [
        city({ sortingName: 'Aichach', live: true }),
        city({ sortingName: 'Augsburg', live: false }),
        city({ sortingName: 'Augsburg', prefix: 'Stadt', live: true }),
        city({ sortingName: 'Dillingen', live: false }),
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

  describe('filterRedundantFallbackLanguageResults', () => {
    it('should filter out fallback language results that are also found in the users language', () => {
      const fallbackLanguageResults = [
        new ExtendedPageModel({
          path: '/testumgebung/de/arbeit',
          title: 'Arbeit',
          content: 'Arbeit',
          lastUpdate: DateTime.now(),
          thumbnail: null,
          availableLanguages: { en: '/testumgebung/en/work' },
        }),
        new ExtendedPageModel({
          path: '/testumgebung/de/willkommen',
          title: 'Willkommen',
          content: 'Willkommen in der Testumgebung',
          lastUpdate: DateTime.now(),
          thumbnail: null,
          availableLanguages: { en: '/testumgebung/en/welcome' },
        }),
        new ExtendedPageModel({
          path: '/testumgebung/de/willkommen/willkommen-in-deutschland',
          title: 'Willkommen in Deutschland',
          content: 'Willkommen in der Deutschland',
          lastUpdate: DateTime.now(),
          thumbnail: null,
          availableLanguages: { en: '/testumgebung/en/welcome/welcome-to-germany' },
        }),
        new ExtendedPageModel({
          path: '/testumgebung/de/bildung/grundschule',
          title: 'Grundschule',
          content: 'Grundschule',
          lastUpdate: DateTime.now(),
          thumbnail: null,
          availableLanguages: { en: '/testumgebung/en/education/primary-school' },
        }),
      ]

      const contentLanguageResults = [
        new ExtendedPageModel({
          path: '/testumgebung/en/welcome',
          title: 'Willkommen',
          content: 'Willkommen in der Testumgebung',
          lastUpdate: DateTime.now(),
          thumbnail: null,
          availableLanguages: { de: '/testumgebung/de/willkommen' },
        }),
        new ExtendedPageModel({
          path: '/testumgebung/en/welcome/welcome-to-germany',
          title: 'Welcome to Germany',
          content: 'Welcome to Germany',
          lastUpdate: DateTime.now(),
          thumbnail: null,
          availableLanguages: { de: '/testumgebung/de/willkommen/willkommen-in-deutschland' },
        }),
      ]

      expect(
        filterRedundantFallbackLanguageResults({
          fallbackLanguageResults,
          contentLanguageResults,
          fallbackLanguage: 'de',
        }),
      ).toEqual([fallbackLanguageResults[0], fallbackLanguageResults[3]])
    })
  })
})
