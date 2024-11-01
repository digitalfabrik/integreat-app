import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/native'

import { ExpandIcon, ShrinkIcon } from '../assets'
import Icon from './base/Icon'
import Text from './base/Text'

const StyledText = styled(Text)`
  font-weight: bold;
  padding: 5px;
`

const StyledButton = styled.TouchableOpacity`
  display: flex;
  flex-direction: ${props => (props.theme.contentDirection === 'rtl' ? 'row-reverse' : 'row')};
  align-items: center;
  gap: 5px;
  justify-content: center;
  align-self: ${props => (props.theme.contentDirection === 'rtl' ? 'flex-end' : 'flex-start')};
`

type DateFilterToggleProps = {
  toggle: boolean
  setToggleDateFilter: (toggle: boolean) => void
}

const FilterToggle = ({ toggle, setToggleDateFilter }: DateFilterToggleProps): ReactElement => {
  const { t } = useTranslation('events')
  return (
    <StyledButton onPress={() => setToggleDateFilter(!toggle)}>
      <Icon Icon={toggle ? ShrinkIcon : ExpandIcon} />
      <StyledText>{t(toggle ? 'hideFilters' : 'showFilters')}</StyledText>
    </StyledButton>
  )
}

export default FilterToggle
