import React, { ReactElement } from 'react'

import { pathnameFromRouteInformation, SHELTER_ROUTE, ShelterModel } from 'api-client'

import CleanLink from './CleanLink'
import ShelterInformation from './ShelterInformation'

type Props = {
  shelter: ShelterModel
  cityCode: string
  languageCode: string
}

const ShelterListItem = ({ shelter, cityCode, languageCode }: Props): ReactElement => (
  <CleanLink
    to={`${pathnameFromRouteInformation({ route: SHELTER_ROUTE, cityCode, languageCode })}/${shelter.id}`}
    newTab>
    <ShelterInformation shelter={shelter} cityCode={cityCode} />
  </CleanLink>
)

export default ShelterListItem
