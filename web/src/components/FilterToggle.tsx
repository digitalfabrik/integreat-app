import { TFunction } from 'i18next'
import React, { ReactElement } from 'react'
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
  t,
}: {
  toggle: boolean
  setToggleDateFilter: React.Dispatch<React.SetStateAction<boolean>>
  t: TFunction<'events', undefined>
}): ReactElement => (
  <HideDateButton label='toggleDate' onClick={() => setToggleDateFilter((prev: boolean) => !prev)}>
    <Icon src={toggle ? ShrinkIcon : ExpandIcon} />
    {toggle ? <span>{t('hideFilters')}</span> : <span>{t('showFilters')}</span>}
  </HideDateButton>
)

export default FilterToggle
