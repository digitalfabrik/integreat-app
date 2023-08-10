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
import CityContentLayout, { CityContentLayoutProps } from '../components/CityContentLayout'
import CityContentToolbar from '../components/CityContentToolbar'
import CleanLink from '../components/CleanLink'
import FailureSwitcher from '../components/FailureSwitcher'
import Helmet from '../components/Helmet'
import List from '../components/List'
import LoadingSpinner from '../components/LoadingSpinner'
import SprungbrettListItem from '../components/SprungbrettListItem'
import { cmsApiBaseUrl } from '../constants/urls'

const Image = styled.img`
  display: block;
  margin: 0 auto;
`

const SprungbrettOfferPage = ({ city, cityCode, languageCode }: CityRouteProps): ReactElement | null => {
  const { t } = useTranslation('sprungbrett')

  const load = useCallback(
    () => loadSprungbrettJobs({ cityCode, languageCode, baseUrl: cmsApiBaseUrl }),
    [cityCode, languageCode]
  )
  const { data, error, loading } = useLoadAsync(load)

  if (!city) {
    return null
  }

  const languageChangePaths = city.languages.map(({ code, name }) => ({
    path: pathnameFromRouteInformation({ route: SPRUNGBRETT_OFFER_ROUTE, cityCode, languageCode: code }),
    name,
    code,
  }))

  const feedbackTarget = data?.sprungbrettOffer ? getSlugFromPath(data.sprungbrettOffer.path) : undefined
  const locationLayoutParams: Omit<CityContentLayoutProps, 'isLoading'> = {
    city,
    languageChangePaths,
    route: SPRUNGBRETT_OFFER_ROUTE,
    languageCode,
    Toolbar: <CityContentToolbar feedbackTarget={feedbackTarget} route={SPRUNGBRETT_OFFER_ROUTE} />,
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

  const pageTitle = `${offer.title} - ${city.name}`

  return (
    <CityContentLayout isLoading={false} {...locationLayoutParams}>
      <Helmet pageTitle={pageTitle} languageChangePaths={languageChangePaths} cityModel={city} />
      <Caption title={offer.title} />
      <List noItemsMessage={t('noOffersAvailable')} renderItem={renderSprungbrettListItem} items={sprungbrettJobs} />
      <CleanLink to='https://www.sprungbrett-intowork.de'>
        <Image src={offer.thumbnail} alt='' />
      </CleanLink>
    </CityContentLayout>
  )
}

export default SprungbrettOfferPage
