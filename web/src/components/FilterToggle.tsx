import styled from '@emotion/styled'
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen'
import FilterListIcon from '@mui/icons-material/FilterList'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import Button from './base/Button'
import Icon from './base/Icon'

const StyledButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 5px;
  white-space: nowrap;
  font-weight: bold;
  padding: 5px;
  margin-bottom: 10px;
`

const Text = styled.span`
  color: ${props => props.theme.legacy.colors.textColor};
`

const FilterToggle = ({
  isDateFilterActive,
  setToggleDateFilter,
}: {
  isDateFilterActive: boolean
  setToggleDateFilter: (isEnabled: boolean) => void
}): ReactElement => {
  const { t } = useTranslation('events')
  return (
    <StyledButton label='toggleDate' onClick={() => setToggleDateFilter(!isDateFilterActive)}>
      <Icon src={isDateFilterActive ? CloseFullscreenIcon : FilterListIcon} />
      <Text>{t(isDateFilterActive ? 'hideFilters' : 'showFilters')}</Text>
    </StyledButton>
  )
}

export default FilterToggle
