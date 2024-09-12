import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { ShrinkIcon, ExpandIcon } from '../assets'
import dimensions from '../constants/dimensions'
import Button from './base/Button'
import Icon from './base/Icon'

const StyledButton = styled(Button)`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;
  white-space: nowrap;
  font-weight: bold;
  padding: 5px;
`

const HideDateButton = styled(StyledButton)`
  display: none;
  align-self: flex-start;

  @media ${dimensions.smallViewport} {
    display: flex;
  }
`

const FilterToggle = ({
  toggle,
  setToggleDateFilter,
}: {
  toggle: boolean
  setToggleDateFilter: (toggle: boolean) => void
}): ReactElement => {
  const { t } = useTranslation('events')
  return (
    <HideDateButton label='toggleDate' onClick={() => setToggleDateFilter(!toggle)}>
      <Icon src={toggle ? ShrinkIcon : ExpandIcon} />
      <span>{t(toggle ? 'hideFilters' : 'showFilters')}</span>
    </HideDateButton>
  )
}

export default FilterToggle
