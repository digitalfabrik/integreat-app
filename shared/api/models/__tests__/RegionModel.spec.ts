import LanguageModelBuilder from '../../endpoints/testing/LanguageModelBuilder'
import RegionModel from '../RegionModel'

describe('RegionModel', () => {
  const regions = [
    new RegionModel({
      name: 'Region',
      code: 'region',
      live: true,
      languages: new LanguageModelBuilder(2).build(),
      eventsEnabled: false,
      poisEnabled: false,
      localNewsEnabled: false,
      tunewsEnabled: false,
      sortingName: 'Region',
      prefix: 'prefix',
      latitude: 48.369696,
      longitude: 10.892578,
      aliases: null,
      boundingBox: [10.7880103, 48.447238, 11.0174493, 48.297834],
      chatEnabled: false,
      chatPrivacyPolicyUrl: null,
    }),
  ]

  describe('find region name', () => {
    it('should return the region name if the region exists', () => {
      expect(RegionModel.findRegionName(regions, 'region')).toBe('Region')
    })

    it('should return the code if the region does not exist', () => {
      expect(RegionModel.findRegionName(regions, 'not_a_region')).toBe('not_a_region')
    })
  })
})
