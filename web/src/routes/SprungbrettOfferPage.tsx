import React, { ReactElement, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import {
  createOffersEndpoint,
  createSprungbrettJobsEndpoint,
  NotFoundError,
  Payload,
  SPRUNGBRETT_OFFER_ROUTE,
  SprungbrettJobModel,
  useLoadFromEndpoint,
  OfferModel,
  pathnameFromRouteInformation,
  getSlug,
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

const SprungbrettOfferPage = ({
  cityModel,
  cityCode,
  languageCode,
  pathname,
  languages,
}: CityRouteProps): ReactElement => {
  const { viewportSmall } = useWindowDimensions()
  const { t } = useTranslation('sprungbrett')

  const requestOffers = useCallback(
    async () => createOffersEndpoint(cmsApiBaseUrl).request({ city: cityCode, language: languageCode }),
    [cityCode, languageCode]
  )
  const { data: offers, loading: offersLoading, error: offersError } = useLoadFromEndpoint(requestOffers)

  const offer = offers?.find((offer: OfferModel) => offer.alias === 'sprungbrett')

  const requestSprungbrettOffer = useCallback(async () => {
    if (!offer) {
      return new Payload(false, null, [])
    }
    return createSprungbrettJobsEndpoint(offer.path).request()
  }, [offer])

  const {
    data: sprungbrettJobs,
    loading: sprungbrettLoading,
    error: sprungbrettError,
  } = useLoadFromEndpoint(requestSprungbrettOffer)

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
    feedbackTargetInformation: offer ? { slug: getSlug(offer.path) } : null,
    languageChangePaths,
    route: SPRUNGBRETT_OFFER_ROUTE,
    languageCode,
    toolbar,
  }

  if (offersLoading || sprungbrettLoading) {
    return (
      <CityContentLayout isLoading {...locationLayoutParams}>
        <LoadingSpinner />
      </CityContentLayout>
    )
  }

  if (!sprungbrettJobs || !offer) {
    const error =
      sprungbrettError ||
      offersError ||
      new NotFoundError({
        type: 'offer',
        id: pathname,
        city: cityCode,
        language: languageCode,
      })

    return (
      <CityContentLayout isLoading={false} {...locationLayoutParams}>
        <FailureSwitcher error={error} />
      </CityContentLayout>
    )
  }

  const renderSprungbrettListItem = (job: SprungbrettJobModel): React.ReactNode => (
    <SprungbrettListItem key={job.id} job={job} />
  )

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
