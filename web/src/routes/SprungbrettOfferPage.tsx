import React, { Fragment, PropsWithChildren, ReactElement, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { SPRUNGBRETT_OFFER_ROUTE, pathnameFromRouteInformation, getSlugFromPath } from 'shared'
import { SprungbrettJobModel, useLoadAsync, loadSprungbrettJobs } from 'shared/api'

import { CityRouteProps } from '../CityContentSwitcher'
import Caption from '../components/Caption'
import CityContentLayout, { CityContentLayoutProps } from '../components/CityContentLayout'
import CityContentToolbar from '../components/CityContentToolbar'
import FailureSwitcher from '../components/FailureSwitcher'
import Helmet from '../components/Helmet'
import List from '../components/List'
import LoadingSpinner from '../components/LoadingSpinner'
import SprungbrettListItem from '../components/SprungbrettListItem'
import Link from '../components/base/Link'
import { cmsApiBaseUrl } from '../constants/urls'

const Image = styled.img`
  display: block;
  margin: 0 auto;
`

type SprungbrettOfferPageProps = {
  embedded?: boolean
} & CityRouteProps

const SprungbrettOfferPage = ({
  city,
  cityCode,
  languageCode,
  embedded,
}: SprungbrettOfferPageProps): ReactElement | null => {
  const { t } = useTranslation('sprungbrett')

  const load = useCallback(
    () => loadSprungbrettJobs({ cityCode, languageCode, baseUrl: cmsApiBaseUrl }),
    [cityCode, languageCode],
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

  const pageTitle = `${data?.sprungbrettOffer.title ?? t('dashboard:offers')} - ${city.name}`
  const feedbackTarget = data?.sprungbrettOffer ? getSlugFromPath(data.sprungbrettOffer.path) : undefined
  const locationLayoutParams: Omit<CityContentLayoutProps, 'isLoading'> = {
    city,
    languageChangePaths,
    route: SPRUNGBRETT_OFFER_ROUTE,
    languageCode,
    Toolbar: (
      <CityContentToolbar feedbackTarget={feedbackTarget} route={SPRUNGBRETT_OFFER_ROUTE} pageTitle={pageTitle} />
    ),
  }

  const Wrapper = embedded
    ? Fragment
    : ({ children }: PropsWithChildren) => (
        <CityContentLayout isLoading={loading} {...locationLayoutParams}>
          {children}
        </CityContentLayout>
      )

  if (loading) {
    return (
      <Wrapper>
        <LoadingSpinner />
      </Wrapper>
    )
  }

  if (!data) {
    return (
      <Wrapper>
        <FailureSwitcher error={error ?? new Error('Data missing')} />
      </Wrapper>
    )
  }

  const renderSprungbrettListItem = (job: SprungbrettJobModel): React.ReactNode => (
    <SprungbrettListItem key={job.id} job={job} />
  )

  const { sprungbrettOffer: offer, sprungbrettJobs } = data

  return (
    <Wrapper>
      {!embedded && <Helmet pageTitle={pageTitle} languageChangePaths={languageChangePaths} cityModel={city} />}
      {!embedded && <Caption title={offer.title} />}
      <List noItemsMessage={t('noOffersAvailable')} renderItem={renderSprungbrettListItem} items={sprungbrettJobs} />
      {!embedded && (
        <Link to='https://www.sprungbrett-intowork.de'>
          <Image src={offer.thumbnail} alt='' />
        </Link>
      )}
    </Wrapper>
  )
}

export default SprungbrettOfferPage
