import setSprungbrettUrl from '../setSprungbrettUrl'

describe('setSprungbrettUrl', () => {
  it('should create an action to set sprungbrett url', () => {
    const url = 'sprungbrett_url.de'
    const action = setSprungbrettUrl(url)
    expect(action).toEqual({
      payload: {
        url: url
      },
      type: 'SET_SPRUNGBRETT_URL'
    })
  })
})
