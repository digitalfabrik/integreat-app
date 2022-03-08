import React, { ReactElement, useCallback } from 'react'
import { useParams } from 'react-router-dom'

import {
  createShelterUkraineEndpoint,
  NotFoundError,
  ShelterUkraineModel,
  pathnameFromRouteInformation,
  SHELTER_URKAINE_ROUTE,
  useLoadFromEndpoint
} from 'api-client'

import { CityRouteProps } from '../CityContentSwitcher'
import Caption from '../components/Caption'
import FailureSwitcher from '../components/FailureSwitcher'
import Helmet from '../components/Helmet'
import List from '../components/List'
import ListItem from '../components/ListItem'
import LoadingSpinner from '../components/LoadingSpinner'
import LocationLayout from '../components/LocationLayout'
import useWindowDimensions from '../hooks/useWindowDimensions'

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

  const requestShelters = useCallback(() => createShelterUkraineEndpoint().request(), [])
  const { data: shelters, loading, error: shelterError } = useLoadFromEndpoint(requestShelters)

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

  if (loading) {
    return (
      <LocationLayout isLoading {...locationLayoutParams}>
        <LoadingSpinner />
      </LocationLayout>
    )
  }

  if (cityCode !== 'augsburg' || !shelters) {
    const error =
      shelterError ||
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

  const pageTitle = `${SHELTER_UKRAINE_TITLE} - ${cityModel.name}`

  if (shelterId) {
    const shelter = shelters.find(it => it.id.toString() === shelterId)
    if (!shelter) {
      const error = new NotFoundError({ type: 'offer', id: pathname, city: cityCode, language: languageCode })
      return (
        <LocationLayout isLoading={false} {...locationLayoutParams}>
          <FailureSwitcher error={error} />
        </LocationLayout>
      )
    }
    return (
      <LocationLayout isLoading={false} {...locationLayoutParams}>
        <div>{shelter.title}</div>
      </LocationLayout>
    )
  }

  const renderListItem = ({ id, title }: ShelterUkraineModel): ReactElement => (
    <ListItem key={id} title={title} path={`${pathname}/${id}`} />
  )

  return (
    <LocationLayout isLoading={false} {...locationLayoutParams}>
      <Helmet pageTitle={pageTitle} languageChangePaths={languageChangePaths} cityModel={cityModel} />
      <Caption title={SHELTER_UKRAINE_TITLE} />
      <List noItemsMessage='Keine Unterkünfte verfügbar' renderItem={renderListItem} items={shelters} />
    </LocationLayout>
  )
}

export default ShelterUkrainePage
