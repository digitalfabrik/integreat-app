import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { FilterProps } from 'api-client/src/endpoints/createShelterEndpoint'

import bedIcon from '../assets/shelter/bed.svg'
import petIcon from '../assets/shelter/pet.svg'
import FacetInput from './FacetInput'
import FacetToggle from './FacetToggle'

type ShelterFilterBarProps = {
  filter: FilterProps
  updateSearchFilter: (key: string, value: string) => void
}

const FilterContainer = styled.div`
  background-color: #f8f8f8;
  border-radius: 4px;
  margin: 12px;
  font-size: 14px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.15);
  display: flex;
  justify-content: space-between;
`

const ShelterFilterBar: React.FC<ShelterFilterBarProps> = ({
  filter,
  updateSearchFilter
}: ShelterFilterBarProps): ReactElement => {
  const { t } = useTranslation('shelter')

  return (
    <FilterContainer>
      <FacetInput
        value={filter.beds ?? ''}
        icon={bedIcon}
        altTag={t('facetBeds')}
        placeholder={t('facetBeds')}
        updateSearchFilter={updateSearchFilter}
        name='beds'
      />
      <FacetToggle
        icon={petIcon}
        name='pets'
        value={filter.pets === '1'}
        updateSearchFilter={updateSearchFilter}
        tooltip={t('facetPets')}
      />
    </FilterContainer>
  )
}

export default ShelterFilterBar
