import React, { ReactElement } from 'react'
import styled from 'styled-components'

import Tooltip from './Tooltip'

const FilterIcon = styled.span<{ value: boolean }>`
  display: flex;
  background-color: ${props => (props.value ? props.theme.colors.themeColor : props.theme.colors.themeColorLight)};
  border: 1px solid ${props => props.theme.colors.textDisabledColor};
  border-radius: 0.25rem;
  padding: 0.25rem;
  cursor: pointer;
`
const FilterFacet = styled.div`
  display: flex;
  flex-wrap: wrap;
`

type FacetToggleProps = {
  icon: string
  tooltip: string
  name: string
  value: boolean
  updateSearchFilter: (key: string, value: string) => void
}

const FacetToggle: React.FC<FacetToggleProps> = ({
  icon,
  tooltip,
  value,
  updateSearchFilter,
  name,
}: FacetToggleProps): ReactElement => {
  const onClickToggle = () => {
    updateSearchFilter(name, !value ? '1' : '0')
  }

  return (
    <FilterFacet>
      <Tooltip text={tooltip} flow='up' trigger='hover'>
        <FilterIcon value={value} onClick={onClickToggle} role='button' tabIndex={0} onKeyPress={onClickToggle}>
          <img alt={tooltip} src={icon} />
        </FilterIcon>
      </Tooltip>
    </FilterFacet>
  )
}

export default FacetToggle
