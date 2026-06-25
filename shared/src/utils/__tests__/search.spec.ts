import LanguageModelBuilder from '../../api/endpoints/testing/LanguageModelBuilder.ts'
import RegionModel from '../../api/models/RegionModel.ts'
import { filterLanguages, filterSortRegions } from '../../index.ts'

describe('search', () => {
  describe('filterSortRegions', () => {
    const defaultAliases: Record<string, { latitude: number; longitude: number }> = {
      Königsbrunn: {
        latitude: 48.267499,
        longitude: 10.889586,
      },
    }
    const region = ({ prefix = 'Stadt', sortingName = 'Augsburg', live = true, aliases = defaultAliases }) =>
      new RegionModel({
        name: [prefix, sortingName].join(' '),
        code: sortingName.toLowerCase(),
        live,
        languages: new LanguageModelBuilder(2).build(),
        eventsEnabled: true,
        placesEnabled: true,
        localNewsEnabled: false,
        tuNewsEnabled: false,
        sortingName,
        prefix,
        aliases,
        latitude: 48.369696,
        longitude: 10.892578,
        boundingBox: [10.7880103, 48.447238, 11.0174493, 48.297834],
        chatEnabled: false,
        chatPrivacyPolicyUrl: null,
      })

    it('should sort by sorting name', () => {
      const regions = [
        region({ sortingName: 'Günzburg' }),
        region({ sortingName: 'Dillingen' }),
        region({ sortingName: 'Augsburg' }),
        region({ sortingName: 'Aichach' }),
      ]
      expect(filterSortRegions(regions, '')).toEqual([regions[3], regions[2], regions[1], regions[0]])
    })

    it('should sort by prefix if sorting names are equal', () => {
      const regions = [
        region({ sortingName: 'Dillingen' }),
        region({ sortingName: 'Augsburg', prefix: 'Stadt' }),
        region({ sortingName: 'Augsburg', prefix: '' }),
        region({ sortingName: 'Aichach' }),
        region({ sortingName: 'Augsburg', prefix: 'Landkreis' }),
      ]
      expect(filterSortRegions(regions, '')).toEqual([regions[3], regions[2], regions[4], regions[1], regions[0]])
    })

    it('should only keep live and valid regions', () => {
      const regions = [
        region({ sortingName: 'Aichach', live: true }),
        region({ sortingName: 'Augsburg', live: false }),
        region({ sortingName: 'Augsburg', prefix: 'Stadt', live: true }),
        region({ sortingName: 'Dillingen', live: false }),
      ]
      expect(filterSortRegions(regions, '')).toEqual([regions[0], regions[2]])
    })

    it('should return all valid matching regions if developer friendly', () => {
      const regions = [
        region({ sortingName: 'Aichach', live: true }),
        region({ sortingName: 'Augsburg', live: false }),
        region({ sortingName: 'Augsburg', prefix: 'Stadt', live: true }),
        region({ sortingName: 'Dillingen', live: false }),
      ]
      expect(filterSortRegions(regions, 'a', true)).toEqual([regions[0], regions[1], regions[2]])
    })

    it('should return all non live regions if filter text is wirschaffendas', () => {
      const regions = [
        region({ sortingName: 'Aichach', live: true }),
        region({ sortingName: 'Augsburg', live: false }),
        region({ sortingName: 'Augsburg', prefix: 'Stadt', live: true }),
        region({ sortingName: 'Dillingen', live: false }),
      ]
      expect(filterSortRegions(regions, 'wirschaffendas', true)).toEqual([regions[1], regions[3]])
    })

    it('should only return live regions with matching names or aliases', () => {
      const regions = [
        region({ sortingName: 'Aichach' }),
        region({ sortingName: 'Bad Kissingen', prefix: 'Landkreis', live: false }),
        region({ sortingName: 'Augsburg', prefix: 'Stadt' }),
        region({ sortingName: 'Baden-Baden' }),
        region({
          sortingName: 'Dillingen',
          aliases: {
            Bächingen: {
              latitude: 48.267499,
              longitude: 10.889586,
            },
          },
        }),
        region({
          sortingName: 'Friedberg',
          aliases: {
            Bachern: {
              latitude: 48.267499,
              longitude: 10.889586,
            },
          },
        }),
        region({ sortingName: 'Nürnberg' }),
      ]
      expect(filterSortRegions(regions, 'ba')).toEqual([regions[3], regions[4], regions[5]])
    })

    it('should not return live regions when the string is mid-word of the names or aliases', () => {
      const regions = [
        region({ sortingName: 'Aichach' }),
        region({ sortingName: 'Stadtbaden' }),
        region({
          sortingName: 'Dillingen',
          aliases: {
            Musterstadtbäden: {
              latitude: 48.267499,
              longitude: 10.889586,
            },
          },
        }),
      ]
      expect(filterSortRegions(regions, 'ba')).toEqual([])
    })
  })
})

describe('filterLanguages', () => {
  const languages = [{ code: 'en', path: '/augsburg/en/', name: 'English' }]
  const userLanguage = 'de'
  const sourceLanguage = 'fr'

  it('should return true for an empty query', () => {
    const query = ''
    expect(filterLanguages(languages, query, userLanguage, userLanguage)).toEqual(languages)
  })

  it('should return true if the query matches the name in the language of the current languages', () => {
    const query = 'english'
    expect(filterLanguages(languages, query, userLanguage, userLanguage)).toEqual(languages)
  })

  it('should return true if the query matches the name in the current language', () => {
    const query = 'angl'
    expect(filterLanguages(languages, query, sourceLanguage, userLanguage)).toEqual(languages)
  })

  it('should return true if the query matches the name in the fallback language', () => {
    const query = 'englisch'
    expect(filterLanguages(languages, query, sourceLanguage, userLanguage)).toEqual(languages)
  })

  it('should return false if nothing matches', () => {
    const query = 'xyz'
    expect(filterLanguages(languages, query, userLanguage, userLanguage)).toEqual([])
  })

  it('should not crash if the user language code is invalid', () => {
    const query = 'english'
    expect(() => filterLanguages(languages, query, 'asdf', sourceLanguage)).not.toThrow()
    expect(filterLanguages(languages, query, 'asdf', sourceLanguage)).toEqual(languages)
  })

  it('should not crash if the source language code is invalid', () => {
    const query = 'english'
    expect(() => filterLanguages(languages, query, userLanguage, 'asdf')).not.toThrow()
    expect(filterLanguages(languages, query, userLanguage, 'asdf')).toEqual(languages)
  })

  it('should still match by language name when both display-name locales are invalid', () => {
    const query = 'english'
    expect(filterLanguages(languages, query, 'asdf', 'asdf')).toEqual(languages)
  })

  it('should return no matches for a non-name query when both display-name locales are invalid', () => {
    const query = 'englisch'
    expect(filterLanguages(languages, query, 'asdf', 'asdf')).toEqual([])
  })
})
