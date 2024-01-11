export const MAX_COMMENT_LENGTH = 200

type SubmitHelpFormParams = {
  cityCode: string
  languageCode: string
  zammadUrl: string
}

const submitHelpForm = async (_props: SubmitHelpFormParams): Promise<void> =>
  // eslint-disable-next-line no-console
  Promise.resolve(console.log('submit'))

export default submitHelpForm
