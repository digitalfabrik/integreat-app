import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { ShrinkIcon, ExpandIcon } from '../assets'
import { useContrastTheme } from '../hooks/useContrastTheme'
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
const Text = styled.span<{ $isContrastTheme: boolean }>`
  color: ${props => props.$isContrastTheme && props.theme.colors.textColor};
`

const FilterToggle = ({
  isDateFilterActive,
  setToggleDateFilter,
}: {
  isDateFilterActive: boolean
  setToggleDateFilter: (isEnabled: boolean) => void
}): ReactElement => {
  const { t } = useTranslation('events')
  const { isContrastTheme } = useContrastTheme()
  return (
    <StyledButton label='toggleDate' onClick={() => setToggleDateFilter(!isDateFilterActive)}>
      <Icon src={isDateFilterActive ? ShrinkIcon : ExpandIcon} />
      <Text $isContrastTheme={isContrastTheme}>{t(isDateFilterActive ? 'hideFilters' : 'showFilters')}</Text>
    </StyledButton>
  )
}

export default FilterToggle
