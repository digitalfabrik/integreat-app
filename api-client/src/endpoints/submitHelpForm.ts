import OfferModel from '../models/OfferModel'

export const MAX_COMMENT_LENGTH = 200
export type ContactChannel = 'eMail' | 'telephone' | 'personally'
export type ContactGender = 'male' | 'female' | 'any'

type BuildHelpFormBodyParams = {
  languageCode: string
  name: string
  roomNumber?: string
  contactChannel: ContactChannel
  additionalContactInformation?: string
  contactGender: ContactGender
  comment: string
  translate: (text: string) => string
}

const buildHelpFormBody = ({
  languageCode,
  name,
  roomNumber,
  contactChannel,
  additionalContactInformation,
  contactGender,
  comment,
  translate,
}: BuildHelpFormBodyParams): string => {
  const anyGenderText = contactGender === 'any' ? translate('contactPersonAnyGender') : undefined
  const maleGenderText = contactGender === 'male' ? translate('contactPersonGenderMale') : undefined
  const femaleGenderText = contactGender === 'female' ? translate('contactPersonGenderFemale') : undefined
  return `
Sprache: ${languageCode}

Name: ${name}
Zimmernummer: ${roomNumber ?? '-'}
So möchte ich kontaktiert werden: ${translate(contactChannel)} ${
    additionalContactInformation ? `(${additionalContactInformation})` : ''
  }
${anyGenderText ?? maleGenderText ?? femaleGenderText}

Beschreibung des Anliegens:
${comment}
`
}

const generateEmail = () => {
  const RANDOM_NUMBER_LENGTH = 8
  const array = new Uint8Array(RANDOM_NUMBER_LENGTH)
  return `support+zammad-ticket-${crypto.getRandomValues(array).join('')}@integreat-app.de`
}

type SubmitHelpFormParams = {
  name: string
  roomNumber?: string
  email?: string
  telephone?: string
  contactChannel: ContactChannel
  contactGender: ContactGender
  comment: string
  cityCode: string
  languageCode: string
  helpButtonOffer: OfferModel
  translate: (text: string) => string
}

type ZammadConfig = {
  enabled: boolean
  endpoint: string
  token?: string
}

const submitHelpForm = async ({
  languageCode,
  cityCode,
  helpButtonOffer,
  name,
  email,
  roomNumber,
  telephone,
  contactChannel,
  contactGender,
  comment,
  translate,
}: SubmitHelpFormParams): Promise<void> => {
  const zammadUrl = helpButtonOffer.postData?.get('zammad-url')

  if (!zammadUrl) {
    return
  }
  const fingerprint = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASw'

  const getZammadConfig = async (): Promise<ZammadConfig> => {
    const response = await fetch(`${zammadUrl}/api/v1/form_config`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fingerprint,
      }),
    })
    return response.json()
  }

  const submitToZammad = async () => {
    const config = await getZammadConfig()
    if (!config.enabled) {
      return null
    }
    const contactChannelEmailAdditionalInfo = contactChannel === 'eMail' ? email : undefined
    const contactChannelTelephoneAdditionalInfo = contactChannel === 'telephone' ? telephone : undefined

    const response = await fetch(config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email: !email?.length ? generateEmail() : email,
        body: buildHelpFormBody({
          languageCode,
          name,
          roomNumber,
          contactChannel,
          contactGender,
          comment,
          additionalContactInformation: contactChannelEmailAdditionalInfo ?? contactChannelTelephoneAdditionalInfo,
          translate,
        }),
        title: `Hilfebutton - ${cityCode}`,
        fingerprint,
        token: config.token,
      }),
    })
    return response.json()
  }
  // eslint-disable-next-line no-console
  console.log(await submitToZammad())
}

export default submitHelpForm
