import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { ShrinkIcon, ExpandIcon } from '../assets'
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
      <Icon src={isDateFilterActive ? ShrinkIcon : ExpandIcon} />
      <span>{t(isDateFilterActive ? 'hideFilters' : 'showFilters')}</span>
    </StyledButton>
  )
}

export default FilterToggle
