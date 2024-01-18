import OfferModel from '../models/OfferModel'

export const MALTE_HELP_FORM_MAX_COMMENT_LENGTH = 400

type SubmitHelpFormParams = {
  cityCode: string
  languageCode: string
  helpButtonOffer: OfferModel
}

const submitHelpForm = async (_props: SubmitHelpFormParams): Promise<void> =>
  // eslint-disable-next-line no-console
  Promise.resolve(console.log('submit'))

export default submitHelpForm
