import determineApiUrl from '../determineApiUrl'
import AppSettings from '../../settings/AppSettings'
import buildConfig from '../../app/constants/buildConfig'
describe('determineApiUrl', () => {
  it('should return the default baseURL if no overrideApiUrl is set', async () => {
    const apiUrl = await determineApiUrl()
    expect(apiUrl).toEqual(buildConfig().cmsUrl)
  })
  it('should return the overrideApiUrl if it is set', async () => {
    new AppSettings().setApiUrlOverride('https://super-cool-override-cms.url.com')
    const apiUrl = await determineApiUrl()
    expect(apiUrl).toEqual('https://super-cool-override-cms.url.com')
  })
})
