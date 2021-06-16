import React, { ReactElement, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { RouteComponentProps } from 'react-router-dom'
import LocationLayout from '../components/LocationLayout'
import {
  CityModel,
  createOffersEndpoint,
  createSprungbrettJobsEndpoint,
  LanguageModel,
  normalizePath,
  NotFoundError,
  Payload,
  SPRUNGBRETT_OFFER_ROUTE,
  SprungbrettJobModel,
  useLoadFromEndpoint
} from 'api-client'
import LocationToolbar from '../components/LocationToolbar'
import { FeedbackRatingType } from '../components/FeedbackToolbarItem'
import SprungbrettListItem from '../components/SprungbrettListItem'
import { cmsApiBaseUrl } from '../constants/urls'
import useWindowDimensions from '../hooks/useWindowDimensions'
import { createPath } from './index'
import LoadingSpinner from '../components/LoadingSpinner'
import FailureSwitcher from '../components/FailureSwitcher'
import Caption from '../components/Caption'
import List from '../components/List'
import CleanAnchor from '../components/CleanAnchor'

const Image = styled.img`
  display: block;
  margin: 0 auto;
`

type PropsType = {
  cities: Array<CityModel>
  cityModel: CityModel
  languages: Array<LanguageModel>
  languageModel: LanguageModel
} & RouteComponentProps<{ cityCode: string; languageCode: string }>

const SprungbrettOfferPage = ({ cityModel, match, location, languages }: PropsType): ReactElement => {
  const { cityCode, languageCode } = match.params
  const pathname = normalizePath(location.pathname)
  const { viewportSmall } = useWindowDimensions()
  const { t } = useTranslation('sprungbrett')

  const requestOffers = useCallback(async () => {
    return createOffersEndpoint(cmsApiBaseUrl).request({ city: cityCode, language: languageCode })
  }, [cityCode, languageCode])
  const { data: offers, loading: offersLoading, error: offersError } = useLoadFromEndpoint(requestOffers)

  const offer = offers?.find(offer => offer.alias === 'sprungbrett')

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

  return (
    <LocationLayout isLoading={false} {...locationLayoutParams}>
      <Caption title={offer.title} />
      <List noItemsMessage={t('noOffersAvailable')} renderItem={renderSprungbrettListItem} items={sprungbrettJobs} />
      <CleanAnchor href='https://www.sprungbrett-intowork.de'>
        <Image src={offer.thumbnail} />
      </CleanAnchor>
    </LocationLayout>
  )
}

export default SprungbrettOfferPage
