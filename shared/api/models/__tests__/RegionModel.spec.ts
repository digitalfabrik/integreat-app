import LanguageModelBuilder from '../../endpoints/testing/LanguageModelBuilder'
import RegionModel from '../RegionModel'

describe('RegionModel', () => {
  const cities = [
    new RegionModel({
      name: 'City',
      code: 'city',
      live: true,
      languages: new LanguageModelBuilder(2).build(),
      eventsEnabled: false,
      poisEnabled: false,
      localNewsEnabled: false,
      tunewsEnabled: false,
      sortingName: 'City',
      prefix: 'prefix',
      latitude: 48.369696,
      longitude: 10.892578,
      aliases: null,
      boundingBox: [10.7880103, 48.447238, 11.0174493, 48.297834],
      chatEnabled: false,
      chatPrivacyPolicyUrl: null,
    }),
  ]

  describe('find city name', () => {
    it('should return the city name if the city exists', () => {
      expect(RegionModel.findCityName(cities, 'city')).toBe('City')
    })

    it('should return the code if the city does not exist', () => {
      expect(RegionModel.findCityName(cities, 'not_a_city')).toBe('not_a_city')
    })
  })
})
