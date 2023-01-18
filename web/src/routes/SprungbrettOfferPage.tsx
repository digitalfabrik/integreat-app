import React, { ReactElement, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import {
  SPRUNGBRETT_OFFER_ROUTE,
  SprungbrettJobModel,
  pathnameFromRouteInformation,
  getSlugFromPath,
  useLoadAsync,
  loadSprungbrettJobs,
} from 'api-client'

import { CityRouteProps } from '../CityContentSwitcher'
import Caption from '../components/Caption'
import CityContentLayout from '../components/CityContentLayout'
import CityContentToolbar from '../components/CityContentToolbar'
import CleanLink from '../components/CleanLink'
import FailureSwitcher from '../components/FailureSwitcher'
import { FeedbackRatingType } from '../components/FeedbackToolbarItem'
import Helmet from '../components/Helmet'
import List from '../components/List'
import LoadingSpinner from '../components/LoadingSpinner'
import SprungbrettListItem from '../components/SprungbrettListItem'
import { cmsApiBaseUrl } from '../constants/urls'
import useWindowDimensions from '../hooks/useWindowDimensions'

const Image = styled.img`
  display: block;
  margin: 0 auto;
`

const SprungbrettOfferPage = ({ cityModel, cityCode, languageCode, languages }: CityRouteProps): ReactElement => {
  const { viewportSmall } = useWindowDimensions()
  const { t } = useTranslation('sprungbrett')

  const load = useCallback(
    () => loadSprungbrettJobs({ cityCode, languageCode, baseUrl: cmsApiBaseUrl }),
    [cityCode, languageCode]
  )
  const { data, error, loading } = useLoadAsync(load)

  const toolbar = (openFeedback: (rating: FeedbackRatingType) => void) => (
    <CityContentToolbar openFeedbackModal={openFeedback} viewportSmall={viewportSmall} />
  )

  const languageChangePaths = languages.map(({ code, name }) => ({
    path: pathnameFromRouteInformation({ route: SPRUNGBRETT_OFFER_ROUTE, cityCode, languageCode: code }),
    name,
    code,
  }))

  const locationLayoutParams = {
    cityModel,
    viewportSmall,
    feedbackTargetInformation: data?.sprungbrettOffer ? { slug: getSlugFromPath(data.sprungbrettOffer.path) } : null,
    languageChangePaths,
    route: SPRUNGBRETT_OFFER_ROUTE,
    languageCode,
    toolbar,
  }

  if (loading) {
    return (
      <CityContentLayout isLoading {...locationLayoutParams}>
        <LoadingSpinner />
      </CityContentLayout>
    )
  }

  if (!data) {
    return (
      <CityContentLayout isLoading={false} {...locationLayoutParams}>
        <FailureSwitcher error={error ?? new Error('Data missing')} />
      </CityContentLayout>
    )
  }

  const renderSprungbrettListItem = (job: SprungbrettJobModel): React.ReactNode => (
    <SprungbrettListItem key={job.id} job={job} />
  )

  const { sprungbrettOffer: offer, sprungbrettJobs } = data

  const pageTitle = `${offer.title} - ${cityModel.name}`

  return (
    <CityContentLayout isLoading={false} {...locationLayoutParams}>
      <Helmet pageTitle={pageTitle} languageChangePaths={languageChangePaths} cityModel={cityModel} />
      <Caption title={offer.title} />
      <List noItemsMessage={t('noOffersAvailable')} renderItem={renderSprungbrettListItem} items={sprungbrettJobs} />
      <CleanLink to='https://www.sprungbrett-intowork.de'>
        <Image src={offer.thumbnail} alt='' />
      </CleanLink>
    </CityContentLayout>
  )
}

export default SprungbrettOfferPage
