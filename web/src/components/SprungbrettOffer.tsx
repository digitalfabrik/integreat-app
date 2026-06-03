import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { OfferModel, createSprungbrettJobsEndpoint } from 'shared/api'

import List from '../components/base/List'
import useQueryFromEndpoint from '../hooks/useQueryFromEndpoint'
import FailureSwitcher from './FailureSwitcher'
import SkeletonList from './SkeletonList'
import SprungbrettListItem from './SprungbrettListItem'

type SprungbrettOfferPageProps = {
  sprungbrettOffer: OfferModel
}

const SprungbrettOffer = ({ sprungbrettOffer }: SprungbrettOfferPageProps): ReactElement | null => {
  const { t } = useTranslation('sprungbrett')

  const { data, error, isPending } = useQueryFromEndpoint(
    createSprungbrettJobsEndpoint,
    sprungbrettOffer.path,
    undefined,
  )

  if (isPending) {
    return <SkeletonList />
  }

  if (error) {
    return <FailureSwitcher error={error} />
  }

  const items = data.map(job => <SprungbrettListItem key={job.url} job={job} />)

  return <List items={items} NoItemsMessage={t('noOffersAvailable')} />
}

export default SprungbrettOffer
