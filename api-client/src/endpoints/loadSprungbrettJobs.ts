import NotFoundError from '../errors/NotFoundError'
import OfferModel from '../models/OfferModel'
import SprungbrettJobModel from '../models/SprungbrettJobModel'
import { SPRUNGBRETT_OFFER_ROUTE } from '../routes'
import createOffersEndpoint from './createOffersEndpoint'
import createSprungbrettJobsEndpoint from './createSprungbrettJobsEndpoint'

type LoadSprungbrettJobsParams = {
  cityCode: string
  languageCode: string
  baseUrl: string | (() => Promise<string>)
}

type LoadSprungbrettJobReturn = Promise<{
  offers: OfferModel[]
  sprungbrettOffer: OfferModel
  sprungbrettJobs: SprungbrettJobModel[]
}>

const loadSprungbrettJobs = async ({
  cityCode,
  languageCode,
  baseUrl,
}: LoadSprungbrettJobsParams): LoadSprungbrettJobReturn => {
  const apiUrl = typeof baseUrl === 'string' ? baseUrl : await baseUrl()
  const sprungbrettOfferAlias = SPRUNGBRETT_OFFER_ROUTE
  const offersPayload = await createOffersEndpoint(apiUrl).request({
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
}

export default loadSprungbrettJobs
