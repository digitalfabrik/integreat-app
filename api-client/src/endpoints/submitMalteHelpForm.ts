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
}

const contactGenderText = (contactGender: ContactGender): string => {
  switch (contactGender) {
    case 'male':
      return 'Ich möchte von einer männlichen Person kontaktiert werden.'
    case 'female':
      return 'Ich möchte von einer weiblichen Person kontaktiert werden.'
    default:
      return 'Das Geschlecht des Ansprechpartners/der Ansprechpartnerin spielt keine Rolle.'
  }
}

const contactChannelText = (contactChannel: ContactChannel): string => {
  switch (contactChannel) {
    case 'eMail':
      return 'E-Mail'
    case 'telephone':
      return 'Telefon'
    default:
      return 'Persönlich'
  }
}

const buildHelpFormBody = ({
  languageCode,
  name,
  roomNumber,
  contactChannel,
  additionalContactInformation,
  contactGender,
  comment,
}: BuildHelpFormBodyParams): string => `
Sprache: ${languageCode}

Name: ${name}
Zimmernummer: ${roomNumber ?? '-'}
So möchte ich kontaktiert werden: ${contactChannelText(contactChannel)} ${
  additionalContactInformation ? `(${additionalContactInformation})` : ''
}
${contactGenderText(contactGender)}

Beschreibung des Anliegens:
${comment}
`

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
}

type ZammadConfig = {
  enabled: boolean
  endpoint: string
  token?: string
}

const getZammadConfig = async (zammadUrl: string, fingerprint: string): Promise<ZammadConfig> => {
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

// more context https://github.com/zammad/zammad/issues/1456
const fingerprint = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASw'

const submitMalteHelpForm = async ({
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
}: SubmitHelpFormParams): Promise<void> => {
  const zammadUrl = helpButtonOffer.postData?.get('zammad-url')
  const config = zammadUrl ? await getZammadConfig(zammadUrl, fingerprint) : undefined

  if (!config?.enabled) {
    return
  }

  const contactChannelEmailAdditionalInfo = contactChannel === 'eMail' ? email : undefined
  const contactChannelTelephoneAdditionalInfo = contactChannel === 'telephone' ? telephone : undefined
  const additionalContactInformation = contactChannelEmailAdditionalInfo ?? contactChannelTelephoneAdditionalInfo

  await fetch(config.endpoint, {
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
        additionalContactInformation,
      }),
      title: `Hilfebutton - ${cityCode}`,
      fingerprint,
      token: config.token,
    }),
  })
}

export default submitMalteHelpForm
