import React, { ReactElement, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import {
  createShelterEndpoint,
  pathnameFromRouteInformation,
  SHELTER_ROUTE,
  ShelterModel,
  ShelterFilterProps,
} from 'api-client'

import { CityRouteProps } from '../CityContentSwitcher'
import Caption from '../components/Caption'
import Helmet from '../components/Helmet'
import InfiniteScrollList from '../components/InfiniteScrollList'
import LocationLayout from '../components/LocationLayout'
import ShelterDetail from '../components/ShelterDetail'
import ShelterFilterBar from '../components/ShelterFilterBar'
import ShelterListItem from '../components/ShelterListItem'
import useWindowDimensions from '../hooks/useWindowDimensions'

const DEFAULT_PAGE = 1
const ITEMS_PER_PAGE = 10

const ShelterPage = ({ cityModel, cityCode, languageCode, pathname, languages }: CityRouteProps): ReactElement => {
  const { shelterId } = useParams()
  const { viewportSmall } = useWindowDimensions()
  const { t } = useTranslation('shelter')
  const [filter, setFilter] = useState<ShelterFilterProps>({ beds: null, city: null, pets: null })

  const loadShelters = useCallback(
    (page: number) =>
      createShelterEndpoint().request({
        type: 'list',
        page,
        cityCode,
        filter,
      }),
    [cityCode, filter]
  )

  const languageChangePaths = languages.map(({ code, name }) => ({
    path: pathnameFromRouteInformation({ route: SHELTER_ROUTE, cityCode, languageCode: code }),
    name,
    code,
  }))

  const updateSearchFilter = (key: string, val: string) => {
    switch (key) {
      case 'beds':
        setFilter({ ...filter, beds: val })
        break
      case 'city':
        setFilter({ ...filter, city: val })
        break
      case 'pets':
        setFilter({ ...filter, pets: val })
        break
    }
  }

  const locationLayoutParams = {
    cityModel,
    viewportSmall,
    feedbackTargetInformation: null,
    languageChangePaths,
    route: SHELTER_ROUTE,
    languageCode,
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
      <ShelterFilterBar filter={filter} updateSearchFilter={updateSearchFilter} />
      <InfiniteScrollList
        noItemsMessage={t('noSheltersAvailable')}
        renderItem={renderListItem}
        loadPage={loadShelters}
        defaultPage={DEFAULT_PAGE}
        itemsPerPage={ITEMS_PER_PAGE}
      />
    </LocationLayout>
  )
}

export default ShelterPage
