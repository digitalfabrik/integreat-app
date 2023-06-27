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
import CityContentLayout from '../components/CityContentLayout'
import Helmet from '../components/Helmet'
import InfiniteScrollList from '../components/InfiniteScrollList'
import ShelterDetail from '../components/ShelterDetail'
import ShelterFilterBar from '../components/ShelterFilterBar'
import ShelterListItem from '../components/ShelterListItem'
import useWindowDimensions from '../hooks/useWindowDimensions'

const DEFAULT_PAGE = 1
const ITEMS_PER_PAGE = 10

const ShelterPage = ({ city, cityCode, languageCode, pathname }: CityRouteProps): ReactElement | null => {
  const { shelterId } = useParams()
  const { viewportSmall } = useWindowDimensions()
  const { t } = useTranslation('shelter')
  const [filter, setFilter] = useState<ShelterFilterProps>({ beds: null, city: null, pets: null })

  const loadShelters = useCallback(
    async (page: number) => {
      const { data } = await createShelterEndpoint().request({
        type: 'list',
        page,
        cityCode,
        filter,
      })

      if (!data) {
        throw new Error('Data missing!')
      }
      return data
    },
    [cityCode, filter]
  )

  if (!city) {
    return null
  }

  const languageChangePaths = city.languages.map(({ code, name }) => ({
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
    city,
    viewportSmall,
    feedbackTargetInformation: null,
    languageChangePaths,
    route: SHELTER_ROUTE,
    languageCode,
  }

  if (shelterId) {
    return (
      <ShelterDetail
        city={city}
        cityCode={cityCode}
        languageCode={languageCode}
        pathname={pathname}
        shelterId={shelterId}
        viewportSmall={viewportSmall}
      />
    )
  }

  const pageTitle = `${t('title')} - ${city.name}`

  const renderListItem = (shelter: ShelterModel): ReactElement => (
    <ShelterListItem key={shelter.id} shelter={shelter} cityCode={cityCode} languageCode={languageCode} />
  )

  return (
    <CityContentLayout isLoading={false} {...locationLayoutParams}>
      <Helmet pageTitle={pageTitle} languageChangePaths={languageChangePaths} cityModel={city} />
      <Caption title={t('title')} />
      <ShelterFilterBar filter={filter} updateSearchFilter={updateSearchFilter} />
      <InfiniteScrollList
        noItemsMessage={t('noSheltersAvailable')}
        renderItem={renderListItem}
        loadPage={loadShelters}
        defaultPage={DEFAULT_PAGE}
        itemsPerPage={ITEMS_PER_PAGE}
      />
    </CityContentLayout>
  )
}

export default ShelterPage
