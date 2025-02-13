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
  flex-direction: row;
  align-items: center;
  gap: 5px;
  align-self: ${props => (props.theme.contentDirection === 'rtl' ? 'flex-end' : 'flex-start')};
`

type DateFilterToggleProps = {
  isDateFilterActive: boolean
  setToggleDateFilter: (isEnabled: boolean) => void
}

const FilterToggle = ({ isDateFilterActive, setToggleDateFilter }: DateFilterToggleProps): ReactElement => {
  const { t } = useTranslation('events')
  return (
    <StyledButton onPress={() => setToggleDateFilter(!isDateFilterActive)}>
      <Icon Icon={isDateFilterActive ? ShrinkIcon : ExpandIcon} />
      <StyledText>{t(isDateFilterActive ? 'hideFilters' : 'showFilters')}</StyledText>
    </StyledButton>
  )
}

export default FilterToggle
