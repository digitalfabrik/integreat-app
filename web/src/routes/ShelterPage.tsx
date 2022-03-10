import React, { ReactElement, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { createShelterEndpoint, pathnameFromRouteInformation, SHELTER_ROUTE, ShelterModel } from 'api-client'

import { CityRouteProps } from '../CityContentSwitcher'
import Caption from '../components/Caption'
import Helmet from '../components/Helmet'
import InfiniteScrollList from '../components/InfiniteScrollList'
import LocationLayout from '../components/LocationLayout'
import ShelterDetail from '../components/ShelterDetail'
import ShelterListItem from '../components/ShelterListItem'
import useWindowDimensions from '../hooks/useWindowDimensions'

const DEFAULT_PAGE = 1
const ITEMS_PER_PAGE = 10

const ShelterPage = ({ cityModel, cityCode, languageCode, pathname, languages }: CityRouteProps): ReactElement => {
  const { shelterId } = useParams()
  const { viewportSmall } = useWindowDimensions()
  const { t } = useTranslation('shelter')

  const loadShelters = useCallback((page: number) => createShelterEndpoint().request({ type: 'list', page }), [])

  const languageChangePaths = languages.map(({ code, name }) => ({
    path: pathnameFromRouteInformation({ route: SHELTER_ROUTE, cityCode, languageCode: code }),
    name,
    code
  }))

  const locationLayoutParams = {
    cityModel,
    viewportSmall,
    feedbackTargetInformation: null,
    languageChangePaths,
    route: SHELTER_ROUTE,
    languageCode
  }

  if (shelterId) {
    return (
      <ShelterDetail
        cityModel={cityModel}
        cityCode={cityCode}
        languageCode={languageCode}
        pathname={pathname}
        languages={languages}
        shelterId={shelterId}
        viewportSmall={viewportSmall}
      />
    )
  }

  const pageTitle = `${t('title')} - ${cityModel.name}`

  const renderListItem = (shelter: ShelterModel): ReactElement => (
    <ShelterListItem key={shelter.id} shelter={shelter} cityCode={cityCode} languageCode={languageCode} />
  )

  return (
    <LocationLayout isLoading={false} {...locationLayoutParams}>
      <Helmet pageTitle={pageTitle} languageChangePaths={languageChangePaths} cityModel={cityModel} />
      <Caption title={t('title')} />
      <InfiniteScrollList
        noItemsMessage='Keine Unterkünfte verfügbar'
        renderItem={renderListItem}
        loadPage={loadShelters}
        defaultPage={DEFAULT_PAGE}
        itemsPerPage={ITEMS_PER_PAGE}
      />
    </LocationLayout>
  )
}

export default ShelterPage
