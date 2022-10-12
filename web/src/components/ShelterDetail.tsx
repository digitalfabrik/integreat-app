import React, { ReactElement, useCallback } from 'react'

import {
  CityModel,
  createShelterEndpoint,
  LanguageModel,
  NotFoundError,
  pathnameFromRouteInformation,
  SHELTER_ROUTE,
  useLoadFromEndpoint,
} from 'api-client'

import CityContentLayout from './CityContentLayout'
import FailureSwitcher from './FailureSwitcher'
import LoadingSpinner from './LoadingSpinner'
import ShelterInformation from './ShelterInformation'

type Props = {
  cityModel: CityModel
  cityCode: string
  languageCode: string
  pathname: string
  languages: LanguageModel[]
  shelterId: string
  viewportSmall: boolean
}

const ShelterDetail = ({
  cityModel,
  cityCode,
  languageCode,
  pathname,
  languages,
  shelterId,
  viewportSmall,
}: Props): ReactElement => {
  const requestShelter = useCallback(
    () =>
      createShelterEndpoint().request({
        type: 'detail',
        id: shelterId,
        cityCode,
      }),
    [shelterId, cityCode]
  )
  const { data: shelters, loading, error } = useLoadFromEndpoint(requestShelter)

  const languageChangePaths = languages.map(({ code, name }) => ({
    path: `${pathnameFromRouteInformation({ route: SHELTER_ROUTE, cityCode, languageCode: code })}/${shelterId}`,
    name,
    code,
  }))
  const locationLayoutParams = {
    cityModel,
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
