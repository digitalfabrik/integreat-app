import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { SprungbrettJobModel, useLoadFromEndpoint, createSprungbrettJobsEndpoint, OfferModel } from 'api-client'

import FailureSwitcher from './FailureSwitcher'
import List from './List'
import LoadingSpinner from './LoadingSpinner'
import SprungbrettListItem from './SprungbrettListItem'

type SprungbrettOfferProps = {
  sprungbrettOffer: OfferModel
  cityCode: string
  languageCode: string
}

const SprungbrettOffer = ({ sprungbrettOffer, cityCode, languageCode }: SprungbrettOfferProps): ReactElement | null => {
  const { data, ...response } = useLoadFromEndpoint(createSprungbrettJobsEndpoint, sprungbrettOffer.path, undefined)
  const { t } = useTranslation('sprungbrett')

  if (response.loading) {
    return <LoadingSpinner />
  }

  if (!data) {
    return <FailureSwitcher error={response.error ?? new Error('Data missing')} />
  }

  const renderSprungbrettListItem = (job: SprungbrettJobModel): React.ReactNode => (
    <SprungbrettListItem key={job.id} job={job} />
  )

  return <List noItemsMessage={t('noOffersAvailable')} renderItem={renderSprungbrettListItem} items={data} />
}

export default SprungbrettOffer
