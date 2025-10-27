import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { OfferModel, useLoadFromEndpoint, createSprungbrettJobsEndpoint } from 'shared/api'

import List from '../components/base/List'
import FailureSwitcher from './FailureSwitcher'
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

  const items = data.map(job => <SprungbrettListItem key={job.url} job={job} />)

  return <List items={items} NoItemsMessage={t('noOffersAvailable')} />
}

export default SprungbrettOffer
