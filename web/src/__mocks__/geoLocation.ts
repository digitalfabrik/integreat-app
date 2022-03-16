export const mockLatitude = 48.3
export const mockLongitude = 10.8

export const mockGeolocationSuccess = {
  getCurrentPosition: jest.fn().mockImplementationOnce(success =>
    Promise.resolve(
      success({
        coords: {
          latitude: mockLatitude,
          longitude: mockLongitude
        }
      })
    )
  )
}
export const mockGeolocationError = {
  getCurrentPosition: jest.fn().mockImplementationOnce(error =>
    Promise.resolve(
      error({
        code: 'notAvailable',
        status: 'unavailable',
        message: 'GeoLocation Error'
      })
    )
  )
}
