import { locationLayoutFetcher } from '../../endpoint/fetchers'

const route = {
  path: '/:city/:language/fetch-pdf/:fetchUrl+',
  fromPath: (segment: string, key: string): string => key === 'fetchUrl' ? `/${segment}` : segment,
  thunk: async (dispatch, getState) => {
    await locationLayoutFetcher(dispatch, getState)
  }
}
export default route
