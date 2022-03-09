import React, { ReactElement } from 'react'

import { ShelterModel } from 'api-client'

import CleanLink from './CleanLink'
import ShelterInformation from './ShelterInformation'

type Props = {
  shelter: ShelterModel
}

const ShelterListItem = ({ shelter }: Props): ReactElement => (
  <CleanLink to={shelter.id.toString()}>
    <ShelterInformation shelter={shelter} />
    {/* TODO IGAPP-944: Add button "Mehr Informationen"/"Anschauen" */}
  </CleanLink>
)

export default ShelterListItem
