import NotFoundError from '../errors/NotFoundError'
import OfferModel from '../models/OfferModel'
import { MALTE_HELP_FORM_OFFER_ROUTE, SPRUNGBRETT_OFFER_ROUTE } from '../routes'
import createOffersEndpoint from './createOffersEndpoint'

type SubmitHelpFormParams = {
  cityCode: string
  languageCode: string
  baseUrl: string | (() => Promise<string>)
}

type SubmitHelpFormReturn = Promise<{
  helpButtonOffer: OfferModel
  submit: () => Promise<void>
}>

const submitHelpForm = async ({ cityCode, languageCode, baseUrl }: SubmitHelpFormParams): SubmitHelpFormReturn => {
  const apiUrl = typeof baseUrl === 'string' ? baseUrl : await baseUrl()
  const helpButtonOfferAlias = MALTE_HELP_FORM_OFFER_ROUTE
  const offersPayload = await createOffersEndpoint(apiUrl).request({
    city: cityCode,
    language: languageCode,
  })

  // const zammadOffer = offersPayload.data?.find(it => it.alias === helpButtonOfferAlias)
  const helpButtonOffer = new OfferModel({
    alias: helpButtonOfferAlias,
    title: 'Kontaktformular',
    path: '',
    thumbnail: '',
  })

  if (!offersPayload.data) {
    throw (
      offersPayload.error ??
      new NotFoundError({
        type: 'offer',
        id: helpButtonOfferAlias,
        city: cityCode,
        language: languageCode,
      })
    )
  }

  const submit = () => {
    const randomBoundary = 0.5
    if (Math.random() > randomBoundary) {
      // eslint-disable-next-line no-console
      return Promise.resolve(console.log('submit'))
    }
    return Promise.reject(new Error('error'))
  }

  return { helpButtonOffer, submit }
}

export default submitHelpForm
