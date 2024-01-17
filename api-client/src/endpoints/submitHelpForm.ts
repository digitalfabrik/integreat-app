import OfferModel from '../models/OfferModel'

export const MAX_COMMENT_LENGTH = 200

type SubmitHelpFormParams = {
  cityCode: string
  languageCode: string
  malteHelpFormOffer: OfferModel
}

const submitHelpForm = async (_props: SubmitHelpFormParams): Promise<void> =>
  // eslint-disable-next-line no-console
  Promise.resolve(console.log('submit'))

export default submitHelpForm
