import setSprungbrettUrl from '../setSprungbrettUrl'
import setSprungbrettUrlAction from '../../actions/setSprungbrettUrl'

describe('setSprungbrettUrl', () => {
  const url = 'sprungbrett_url.de'
  const action = setSprungbrettUrlAction(url)

  it('should return the initial state', () => {
    expect(setSprungbrettUrl(undefined, action)).toEqual({
      url: url
    })
  })
})
