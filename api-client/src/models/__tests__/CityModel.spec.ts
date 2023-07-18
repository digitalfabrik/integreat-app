import LanguageModelBuilder from '../../testing/LanguageModelBuilder'
import CityModel from '../CityModel'

describe('CityModel', () => {
  const cities = [
    new CityModel({
      name: 'City',
      code: 'city',
      live: true,
      languages: new LanguageModelBuilder(2).build(),
      eventsEnabled: false,
      offersEnabled: false,
      poisEnabled: false,
      localNewsEnabled: false,
      tunewsEnabled: false,
      sortingName: 'City',
      prefix: 'prefix',
      latitude: 48.369696,
      longitude: 10.892578,
      aliases: null,
      boundingBox: null,
    }),
  ]

  describe('find city name', () => {
    it('should return the city name if the city exists', () => {
      expect(CityModel.findCityName(cities, 'city')).toBe('City')
    })

    it('should return the code if the city does not exist', () => {
      expect(CityModel.findCityName(cities, 'not_a_city')).toBe('not_a_city')
    })
  })
})
