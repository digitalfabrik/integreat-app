import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { FilterProps } from 'api-client/src/endpoints/createShelterEndpoint'

import { BedIcon, PetIcon } from '../assets'
import dimensions from '../constants/dimensions'
import FacetInput from './FacetInput'
import FacetToggle from './FacetToggle'
import HighlightBox from './HighlightBox'

type ShelterFilterBarProps = {
  filter: FilterProps
  updateSearchFilter: (key: string, value: string) => void
}

const FilterContainer = styled(HighlightBox)`
  margin: 12px;
  font-size: 14px;
  display: flex;
  justify-content: space-between;

  @media ${dimensions.smallViewport} {
    flex-wrap: wrap;
    gap: 8px;
  }
`

const ShelterFilterBar: React.FC<ShelterFilterBarProps> = ({
  filter,
  updateSearchFilter,
}: ShelterFilterBarProps): ReactElement => {
  const { t } = useTranslation('shelter')

  return (
    <FilterContainer>
      <FacetInput
        value={filter.beds ?? ''}
        icon={BedIcon}
        altTag={t('facetBeds')}
        placeholder={t('facetBeds')}
        updateSearchFilter={updateSearchFilter}
        type='number'
        name='beds'
      />
      {/* TODO comment in when backend is ready https://git.tuerantuer.org/DF/wohnraumboerse_formular/issues/33 */}
      {/* <FacetInput */}
      {/*  value={filter.city ?? ''} */}
      {/*  icon={cityIcon} */}
      {/*  altTag={t('facetCity')} */}
      {/*  placeholder={t('facetCity')} */}
      {/*  updateSearchFilter={updateSearchFilter} */}
      {/*  type='string' */}
      {/*  name='city' */}
      {/* /> */}
      <FacetToggle
        icon={PetIcon}
        name='pets'
        value={filter.pets === '1'}
        updateSearchFilter={updateSearchFilter}
        tooltip={t('facetPets')}
      />
    </FilterContainer>
  )
}

export default ShelterFilterBar
