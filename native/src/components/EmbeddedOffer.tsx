import React, { ReactElement } from 'react'

import { LoadSprungbrettJobReturn } from 'api-client'

import SprungbrettOffer from '../routes/SprungbrettOffer'

export type EmbeddedOfferReturns = Awaited<LoadSprungbrettJobReturn>

type EmbeddedOfferProps = {
  extra?: EmbeddedOfferReturns
  languageCode: string
}

const EmbeddedOffer = ({ extra, languageCode }: EmbeddedOfferProps): ReactElement | null => {
  if (extra && extra.sprungbrettJobs) {
    return <SprungbrettOffer jobs={extra.sprungbrettJobs} language={languageCode} />
  }
  return null
}

export default EmbeddedOffer
