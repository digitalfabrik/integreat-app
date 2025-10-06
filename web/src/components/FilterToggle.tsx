import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen'
import FilterListIcon from '@mui/icons-material/FilterList'
import AccordionSummary from '@mui/material/AccordionSummary'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

const StyledAccordionSummary = styled(AccordionSummary)`
  padding: 0;
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
    <StyledAccordionSummary onClick={() => setToggleDateFilter(!isDateFilterActive)}>
      <Button component='div' startIcon={isDateFilterActive ? <CloseFullscreenIcon /> : <FilterListIcon />}>
        {t(isDateFilterActive ? 'hideFilters' : 'showFilters')}
      </Button>
    </StyledAccordionSummary>
  )
}

export default FilterToggle
