import { filterSortRegions } from '../..'
import LanguageModelBuilder from '../../api/endpoints/testing/LanguageModelBuilder'
import RegionModel from '../../api/models/RegionModel'

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
      expect(filterSortRegions(regions, 'a', true)).toEqual([regions[0], regions[1], regions[2], regions[3]])
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
        region({ sortingName: 'Aichach', prefix: 'Landkreis', live: false }),
        region({ sortingName: 'Augsburg', prefix: 'Stadt' }),
        region({ sortingName: 'Dachau' }),
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
      expect(filterSortRegions(regions, 'äch')).toEqual([regions[0], regions[3], regions[4], regions[5]])
    })
  })
})
