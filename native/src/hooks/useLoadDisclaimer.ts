import { createDisclaimerEndpoint, PageModel } from 'api-client'

import useLoadCityContent, { CityContentReturn } from './useLoadCityContent'

type UseLoadDisclaimerProps = {
  cityCode: string
  languageCode: string
}

const useLoadDisclaimer = (params: UseLoadDisclaimerProps): CityContentReturn<{ disclaimer: PageModel }> =>
  useLoadCityContent({ ...params, createEndpoint: createDisclaimerEndpoint, map: data => ({ disclaimer: data }) })

export default useLoadDisclaimer
