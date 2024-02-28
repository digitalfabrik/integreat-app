import getUserLocation from '../getUserLocation'

describe('getUserLocation', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const latitude = 48.3
  const longitude = 10.8

  it('should correctly receive user coordinates', async () => {
    // @ts-expect-error Read only var
    navigator.geolocation = {
      // @ts-expect-error not all properties supplied
      getCurrentPosition: (resolve: PositionCallback) => resolve({ coords: { longitude, latitude } }),
    }
    const userLocation = await getUserLocation()
    expect(userLocation.status).toBe('ready')
    expect(userLocation.coordinates).toEqual([longitude, latitude])
  })
})
