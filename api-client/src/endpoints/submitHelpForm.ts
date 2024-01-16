import OfferModel from '../models/OfferModel'

export const MAX_COMMENT_LENGTH = 200
export type ContactChannel = 'email' | 'telephone' | 'personally'
export type ContactGender = 'male' | 'female' | 'any'

type BuildHelpFormBodyParams = {
  name: string
  roomNumber?: string
  contactChannel: ContactChannel
  additionalContactInformation?: string
  contactGender: ContactGender
  comment: string
  translate: (text: string) => string
}

const buildHelpFormBody = ({
  name,
  roomNumber,
  contactChannel,
  additionalContactInformation,
  contactGender,
  comment,
  translate,
}: BuildHelpFormBodyParams): string => `
  Name: ${name}
  Zimmernummer: ${roomNumber ?? '-'}
  So möchte ich kontaktiert werden: ${translate(contactChannel)} ${
    additionalContactInformation ? `(${additionalContactInformation})` : ''
  }
  Das Geschlecht der Kontaktperson sollte ${translate(contactGender)} sein.

  ${comment}
  `

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
  helpButtonOffer,
  name,
  email,
  roomNumber,
  telephone,
  contactChannel,
  contactGender,
  comment,
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
    const contactChannelEmailAdditionalInfo = contactChannel === 'email' ? email : undefined
    const contactChannelTelephoneAdditionalInfo = contactChannel === 'telephone' ? telephone : undefined

    const response = await fetch(config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        body: buildHelpFormBody({
          name,
          roomNumber,
          contactChannel,
          contactGender,
          comment,
          additionalContactInformation: contactChannelEmailAdditionalInfo ?? contactChannelTelephoneAdditionalInfo,
          translate: text => text,
        }),
        title: 'Hilfebutton',
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
