import React, { ReactElement, useCallback } from 'react'
import { useParams } from 'react-router-dom'

import {
  createShelterUkraineEndpoint,
  ShelterUkraineModel,
  pathnameFromRouteInformation,
  SHELTER_URKAINE_ROUTE
} from 'api-client'

import { CityRouteProps } from '../CityContentSwitcher'
import Caption from '../components/Caption'
import Helmet from '../components/Helmet'
import InfiniteScrollList from '../components/InfiniteScrollList'
import ListItem from '../components/ListItem'
import LocationLayout from '../components/LocationLayout'
import ShelterDetail from '../components/ShelterDetail'
import useWindowDimensions from '../hooks/useWindowDimensions'

const DEFAULT_PAGE = 1
const ITEMS_PER_PAGE = 10
export const SHELTER_UKRAINE_TITLE = 'Unterkunft Ukraine'
export const SHELTER_UKRAINE_ICON =
  'https://cms.integreat-app.de/augsburg/wp-content/uploads/sites/2/2017/03/Unterkunft-Wohnen-150x150.png'

const ShelterUkrainePage = ({
  cityModel,
  cityCode,
  languageCode,
  pathname,
  languages
}: CityRouteProps): ReactElement => {
  const { shelterId } = useParams()
  const { viewportSmall } = useWindowDimensions()

  const loadShelters = useCallback((page: number) => createShelterUkraineEndpoint().request({ type: 'list', page }), [])

  const languageChangePaths = languages.map(({ code, name }) => ({
    path: pathnameFromRouteInformation({ route: SHELTER_URKAINE_ROUTE, cityCode, languageCode: code }),
    name,
    code
  }))

  const locationLayoutParams = {
    cityModel,
    viewportSmall,
    feedbackTargetInformation: null,
    languageChangePaths,
    route: SHELTER_URKAINE_ROUTE,
    languageCode
  }

  const pageTitle = `${SHELTER_UKRAINE_TITLE} - ${cityModel.name}`

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

  const renderListItem = ({ id, quarter }: ShelterUkraineModel): ReactElement => (
    <ListItem key={id} title={quarter} path={`${pathname}/${id}`} />
  )

  return (
    <LocationLayout isLoading={false} {...locationLayoutParams}>
      <Helmet pageTitle={pageTitle} languageChangePaths={languageChangePaths} cityModel={cityModel} />
      <Caption title={SHELTER_UKRAINE_TITLE} />
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

export default ShelterUkrainePage
