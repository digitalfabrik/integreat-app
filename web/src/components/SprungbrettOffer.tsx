import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { SprungbrettJobModel, OfferModel, useLoadFromEndpoint, createSprungbrettJobsEndpoint } from 'shared/api'

import FailureSwitcher from './FailureSwitcher'
import List from './List'
import LoadingSpinner from './LoadingSpinner'
import SprungbrettListItem from './SprungbrettListItem'

type SprungbrettOfferPageProps = {
  sprungbrettOffer: OfferModel
}

const SprungbrettOffer = ({ sprungbrettOffer }: SprungbrettOfferPageProps): ReactElement | null => {
  const { t } = useTranslation('sprungbrett')

  const { data, error, loading } = useLoadFromEndpoint(createSprungbrettJobsEndpoint, sprungbrettOffer.path, undefined)

  if (loading) {
    return <LoadingSpinner />
  }

  if (!data) {
    return <FailureSwitcher error={error ?? new Error('Data missing')} />
  }

  const renderSprungbrettListItem = (job: SprungbrettJobModel): React.ReactNode => (
    <SprungbrettListItem key={job.id} job={job} />
  )

  return (
    <List
      noItemsMessage={t('noOffersAvailable')}
      renderItem={renderSprungbrettListItem}
      items={data}
      getKey={job => job.id}
    />
  )
}

export default SprungbrettOffer
