import { TFunction } from 'i18next'
import React, { ReactElement } from 'react'
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
  setToggleDateFilter: React.Dispatch<React.SetStateAction<boolean>>
  t: TFunction<'events', undefined>
}

const FilterToggle = ({ toggle, setToggleDateFilter, t }: DateFilterToggleProps): ReactElement => (
  <StyledButton onPress={() => setToggleDateFilter((prev: boolean) => !prev)}>
    <Icon Icon={toggle ? ShrinkIcon : ExpandIcon} />
    {toggle ? <StyledText>{t('hideFilters')}</StyledText> : <StyledText>{t('showFilters')}</StyledText>}
  </StyledButton>
)
export default FilterToggle
