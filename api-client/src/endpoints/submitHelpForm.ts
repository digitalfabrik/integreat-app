import { useCallback } from 'react'

import OfferModel from '../models/OfferModel'

export const MALTE_HELP_FORM_MAX_COMMENT_LENGTH = 400

type SubmitHelpFormParams = {
  name: string
  email?: string
  body?: string
  cityCode: string
  languageCode: string
  helpButtonOffer: OfferModel
}

type ZammadConfig = {
  enabled: boolean
  endpoint: string
  token?: string
}

const submitHelpForm = async ({ helpButtonOffer, name, email, body }: SubmitHelpFormParams): Promise<void> => {
  const zammadUrl = helpButtonOffer.postData?.get('zammadUrl')

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
    const response = await fetch(config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        body,
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
