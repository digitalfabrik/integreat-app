import createWohnenEndpoint from '../createWohnenEndpoint'
describe('createWohnenEndpoint', () => {
  const baseUrl = 'https://wohnen-api-url.de'
  const wohnen = createWohnenEndpoint(baseUrl)
  const json = [
    {
      email: 'markl@integreat-app.de',
      formData: {
        landlord: {
          firstName: 'Michael',
          lastName: 'Markl',
          phone: '0123 / 456789'
        },
        accommodation: {
          ofRooms: ['kitchen', 'child1'],
          title: '2 ZKB mit Balkon und Garten, WG-geeignet',
          location: 'Mittendrin',
          totalArea: 123,
          totalRooms: 2,
          moveInDate: '2019-03-03T17:44:06.000Z',
          ofRoomsDiff: [
            'bath',
            'wc',
            'child2',
            'child3',
            'bed',
            'livingroom',
            'hallway',
            'store',
            'basement',
            'balcony'
          ]
        },
        costs: {
          ofRunningServices: ['heating', 'chimney'],
          ofAdditionalServices: ['garage'],
          baseRent: 300,
          runningCosts: 200,
          hotWaterInHeatingCosts: false,
          additionalCosts: 20,
          ofRunningServicesDiff: ['water', 'garbage'],
          ofAdditionalServicesDiff: []
        },
        version: 1
      },
      createdDate: '2019-03-03T17:45:11.050Z'
    }
  ]
  const city = 'augsburg'
  it('should map router to url', () => {
    expect(
      wohnen.mapParamsToUrl({
        city
      })
    ).toEqual('https://wohnen-api-url.de/augsburg/offer')
  })
  it('should map fetched data to models', () => {
    const wohnenModel = wohnen.mapResponse(json, {
      city
    })
    expect(wohnenModel).toMatchSnapshot()
  })
})