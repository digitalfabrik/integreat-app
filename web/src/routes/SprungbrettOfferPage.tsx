import React, { ReactElement, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import {
  createOffersEndpoint,
  createSprungbrettJobsEndpoint,
  normalizePath,
  NotFoundError,
  Payload,
  SPRUNGBRETT_OFFER_ROUTE,
  SprungbrettJobModel,
  useLoadFromEndpoint,
  OfferModel
} from 'api-client'

import { CityRouteProps } from '../CityContentSwitcher'
import Caption from '../components/Caption'
import CleanAnchor from '../components/CleanAnchor'
import FailureSwitcher from '../components/FailureSwitcher'
import { FeedbackRatingType } from '../components/FeedbackToolbarItem'
import Helmet from '../components/Helmet'
import List from '../components/List'
import LoadingSpinner from '../components/LoadingSpinner'
import LocationLayout from '../components/LocationLayout'
import LocationToolbar from '../components/LocationToolbar'
import SprungbrettListItem from '../components/SprungbrettListItem'
import { cmsApiBaseUrl } from '../constants/urls'
import useWindowDimensions from '../hooks/useWindowDimensions'
import { createPath, RouteProps } from './index'

const Image = styled.img`
  display: block;
  margin: 0 auto;
`

type PropsType = CityRouteProps & RouteProps<typeof SPRUNGBRETT_OFFER_ROUTE>

const SprungbrettOfferPage = ({ cityModel, match, location, languages }: PropsType): ReactElement => {
  const { cityCode, languageCode } = match.params
  const pathname = normalizePath(location.pathname)
  const { viewportSmall } = useWindowDimensions()
  const { t } = useTranslation('sprungbrett')

  const requestOffers = useCallback(async () => {
    return createOffersEndpoint(cmsApiBaseUrl).request({ city: cityCode, language: languageCode })
  }, [cityCode, languageCode])
  const { data: offers, loading: offersLoading, error: offersError } = useLoadFromEndpoint(requestOffers)

  const offer = offers?.find((offer: OfferModel) => offer.alias === 'sprungbrett')

  const requestSprungbrettOffer = useCallback(async () => {
    if (!offer) {
      return new Payload(false, null, [])
    }
    return createSprungbrettJobsEndpoint(offer.path).request()
  }, [offer])

  const { data: sprungbrettJobs, loading: sprungbrettLoading, error: sprungbrettError } = useLoadFromEndpoint(
    requestSprungbrettOffer
  )

  const toolbar = (openFeedback: (rating: FeedbackRatingType) => void) => (
    <LocationToolbar openFeedbackModal={openFeedback} viewportSmall={viewportSmall} />
  )

  const languageChangePaths = languages.map(({ code, name }) => {
    return {
      path: createPath(SPRUNGBRETT_OFFER_ROUTE, { cityCode, languageCode: code }),
      name,
      code
    }
  })

  const locationLayoutParams = {
    cityModel,
    viewportSmall,
    feedbackTargetInformation: offer ? { path: offer.path } : null,
    languageChangePaths,
    route: SPRUNGBRETT_OFFER_ROUTE,
    languageCode,
    pathname,
    toolbar
  }

  if (offersLoading || sprungbrettLoading) {
    return (
      <LocationLayout isLoading {...locationLayoutParams}>
        <LoadingSpinner />
      </LocationLayout>
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
        language: languageCode
      })

    return (
      <LocationLayout isLoading={false} {...locationLayoutParams}>
        <FailureSwitcher error={error} />
      </LocationLayout>
    )
  }

  const renderSprungbrettListItem = (job: SprungbrettJobModel): React.ReactNode => (
    <SprungbrettListItem key={job.id} job={job} />
  )

  const pageTitle = `${offer.title} - ${cityModel.name}`

  return (
    <LocationLayout isLoading={false} {...locationLayoutParams}>
      <Helmet pageTitle={pageTitle} languageChangePaths={languageChangePaths} cityModel={cityModel} />
      <Caption title={offer.title} />
      <List noItemsMessage={t('noOffersAvailable')} renderItem={renderSprungbrettListItem} items={sprungbrettJobs} />
      <CleanAnchor href='https://www.sprungbrett-intowork.de'>
        <Image src={offer.thumbnail} />
      </CleanAnchor>
    </LocationLayout>
  )
}

export default SprungbrettOfferPage
