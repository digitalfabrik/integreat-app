import { useCallback } from 'react'

import {
  createOffersEndpoint,
  createSprungbrettJobsEndpoint,
  NotFoundError,
  OfferModel,
  SPRUNGBRETT_OFFER_ROUTE,
  SprungbrettJobModel,
} from 'api-client'

import { determineApiUrl } from '../utils/helpers'
import useLoadExtraCityContent, { UseLoadExtraCityContentReturn } from './useLoadExtraCityContent'

type UseLoadOffersProps = {
  cityCode: string
  languageCode: string
}

const useLoadSprungbrettJobs = ({
  cityCode,
  languageCode,
}: UseLoadOffersProps): UseLoadExtraCityContentReturn<{
  offers: OfferModel[]
  sprungbrettOffer: OfferModel
  sprungbrettJobs: SprungbrettJobModel[]
}> => {
  const load = useCallback(async () => {
    const sprungbrettOfferAlias = SPRUNGBRETT_OFFER_ROUTE
    const offersPayload = await createOffersEndpoint(await determineApiUrl()).request({
      city: cityCode,
      language: languageCode,
    })

    const sprungbrettOffer = offersPayload.data?.find(it => it.alias === sprungbrettOfferAlias)

    if (!offersPayload.data || !sprungbrettOffer) {
      throw (
        offersPayload.error ??
        new NotFoundError({
          type: 'offer',
          id: sprungbrettOfferAlias,
          city: cityCode,
          language: languageCode,
        })
      )
    }

    const sprungbrettJobsPayload = await createSprungbrettJobsEndpoint(sprungbrettOffer.path).request(undefined)

    if (!sprungbrettJobsPayload.data) {
      throw new Error('Data missing!')
    }

    return { offers: offersPayload.data, sprungbrettOffer, sprungbrettJobs: sprungbrettJobsPayload.data }
  }, [cityCode, languageCode])

  return useLoadExtraCityContent({ cityCode, languageCode, load })
}

export default useLoadSprungbrettJobs
