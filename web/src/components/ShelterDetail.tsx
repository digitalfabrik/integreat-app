import React, { ReactElement } from 'react'

import {
  CityModel,
  createShelterEndpoint,
  NotFoundError,
  pathnameFromRouteInformation,
  SHELTER_ROUTE,
  useLoadFromEndpoint,
} from 'api-client'

import CityContentLayout from './CityContentLayout'
import FailureSwitcher from './FailureSwitcher'
import LoadingSpinner from './LoadingSpinner'
import ShelterInformation from './ShelterInformation'

type ShelterDetailProps = {
  city: CityModel
  cityCode: string
  languageCode: string
  pathname: string
  shelterId: string
  viewportSmall: boolean
}

const ShelterDetail = ({
  city,
  cityCode,
  languageCode,
  pathname,
  shelterId,
  viewportSmall,
}: ShelterDetailProps): ReactElement => {
  const {
    data: shelters,
    loading,
    error,
  } = useLoadFromEndpoint(createShelterEndpoint, '', {
    type: 'detail',
    id: shelterId,
    cityCode,
  })

  const languageChangePaths = city.languages.map(({ code, name }) => ({
    path: `${pathnameFromRouteInformation({ route: SHELTER_ROUTE, cityCode, languageCode: code })}/${shelterId}`,
    name,
    code,
  }))
  const locationLayoutParams: Omit<CityContentLayoutProps, 'isLoading'> = {
    city,
    viewportSmall,
    feedbackTargetInformation: null,
    languageChangePaths,
    route: SHELTER_ROUTE,
    languageCode,
  }

  if (loading) {
    return (
      <CityContentLayout isLoading {...locationLayoutParams}>
        <LoadingSpinner />
      </CityContentLayout>
    )
  }

  const shelter = shelters?.find(it => it.id.toString() === shelterId)

  if (!shelter) {
    const notFoundError = new NotFoundError({ type: 'offer', id: pathname, city: cityCode, language: languageCode })
    return (
      <CityContentLayout isLoading={false} {...locationLayoutParams}>
        <FailureSwitcher error={error || notFoundError} />
      </CityContentLayout>
    )
  }
  return (
    <CityContentLayout isLoading={false} {...locationLayoutParams}>
      <ShelterInformation shelter={shelter} cityCode={cityCode} extended />
    </CityContentLayout>
  )
}

export default ShelterDetail
