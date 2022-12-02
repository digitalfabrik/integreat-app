import { useCallback } from 'react'

import { createDisclaimerEndpoint, PageModel } from 'api-client'

import { determineApiUrl } from '../utils/helpers'
import useLoadCityContent, { CityContentReturn } from './useLoadCityContent'

type UseLoadDisclaimerProps = {
  cityCode: string
  languageCode: string
}

const useLoadDisclaimer = ({
  cityCode,
  languageCode,
}: UseLoadDisclaimerProps): CityContentReturn<{ disclaimer: PageModel }> => {
  const load = useCallback(async () => {
    const payload = await createDisclaimerEndpoint(await determineApiUrl()).request({
      city: cityCode,
      language: languageCode,
    })
    return payload.data ? { disclaimer: payload.data } : null
  }, [cityCode, languageCode])

  return useLoadCityContent({ cityCode, languageCode, load })
}

export default useLoadDisclaimer
