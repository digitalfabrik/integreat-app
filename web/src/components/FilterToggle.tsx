import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen'
import FilterListIcon from '@mui/icons-material/FilterList'
import AccordionSummary from '@mui/material/AccordionSummary'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import Icon from './base/Icon'

const StyledContainer = styled('div')`
  display: flex;
  align-items: center;
  gap: 5px;
  white-space: nowrap;
  font-weight: bold;
  padding: 5px;
`

const StyledTypography = styled(Typography)`
  color: ${props => props.theme.palette.primary.main};
`

const StyledIcon = styled(Icon)`
  color: ${props => props.theme.palette.primary.main};
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
    <AccordionSummary onClick={() => setToggleDateFilter(!isDateFilterActive)}>
      <StyledContainer>
        <StyledIcon src={isDateFilterActive ? CloseFullscreenIcon : FilterListIcon} />
        <StyledTypography variant='button'>{t(isDateFilterActive ? 'hideFilters' : 'showFilters')}</StyledTypography>
      </StyledContainer>
    </AccordionSummary>
  )
}

export default FilterToggle
