import React, { ReactElement } from 'react'

import { ErrorCode, fromError } from 'api-client'

import { EmbeddedOffersReturn } from '../hooks/useEmbeddedOffers'
import SprungbrettOffer from '../routes/SprungbrettOffer'
import Failure from './Failure'
import LoadingSpinner from './LoadingSpinner'

type EmbeddedOfferProps = {
  embeddedOffers: EmbeddedOffersReturn
  languageCode: string
}

const EmbeddedOffer = ({ embeddedOffers, languageCode }: EmbeddedOfferProps): ReactElement | null => {
  if (embeddedOffers.loading) {
    return <LoadingSpinner />
  }

  if (embeddedOffers.error) {
    return <Failure code={fromError(embeddedOffers.error)} buttonAction={embeddedOffers.refresh} />
  }

  if (!embeddedOffers.embeddedOffers) {
    return <Failure code={ErrorCode.PageNotFound} buttonAction={embeddedOffers.refresh} />
  }
  const { sprungbrett } = embeddedOffers.embeddedOffers
  if (sprungbrett) {
    return <SprungbrettOffer jobs={sprungbrett.sprungbrettJobs} language={languageCode} embedded />
  }
  return null
}

export default EmbeddedOffer