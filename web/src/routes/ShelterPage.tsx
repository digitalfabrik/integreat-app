import React, { ReactElement, useCallback } from 'react'
import { useParams } from 'react-router-dom'

import { createShelterEndpoint, pathnameFromRouteInformation, SHELTER_ROUTE, ShelterModel } from 'api-client'

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
export const SHELTER_ICON =
  'https://cms.integreat-app.de/augsburg/wp-content/uploads/sites/2/2017/03/Unterkunft-Wohnen-150x150.png'

const ShelterPage = ({ cityModel, cityCode, languageCode, pathname, languages }: CityRouteProps): ReactElement => {
  const { shelterId } = useParams()
  const { viewportSmall } = useWindowDimensions()

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

  const pageTitle = `Unterkunft Ukraine - ${cityModel.name}`

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

  const renderListItem = ({ id, quarter }: ShelterModel): ReactElement => (
    <ListItem key={id} title={quarter} path={`${pathname}/${id}`} />
  )

  return (
    <LocationLayout isLoading={false} {...locationLayoutParams}>
      <Helmet pageTitle={pageTitle} languageChangePaths={languageChangePaths} cityModel={cityModel} />
      <Caption title={'Unterkunft Ukraine'} />
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
