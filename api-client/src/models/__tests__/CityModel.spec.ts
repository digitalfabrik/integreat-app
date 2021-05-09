import CityModel from '../CityModel'
describe('CityModel', () => {
  const cities = [
    new CityModel({
      name: 'City',
      code: 'city',
      live: true,
      eventsEnabled: false,
      offersEnabled: false,
      poisEnabled: false,
      pushNotificationsEnabled: false,
      tunewsEnabled: false,
      sortingName: 'City',
      prefix: 'prefix',
      longitude: null,
      latitude: null,
      aliases: null
    })
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