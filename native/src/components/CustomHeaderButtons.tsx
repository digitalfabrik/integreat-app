import React, { ReactElement, ReactNode } from 'react'
import { ColorValue } from 'react-native'
import { HeaderButton, HeaderButtonProps, HeaderButtons } from 'react-navigation-header-buttons'
import styled from 'styled-components/native'

import Icon from './base/Icon'

const StyledHeaderContainer = styled.View`
  margin: 0 10px;
`

const CustomIcon = styled(Icon)<{ isHidden: boolean }>`
  display: ${props => (props.isHidden ? 'none' : 'flex')};
`

type HeaderIconProps = {
  name: 'search' | 'language'
  size?: number
  color?: ColorValue
}

const HeaderIcon = ({ name, ...props }: HeaderIconProps): ReactElement => {
  if (!['language', 'search'].includes(name)) {
    throw new Error('Invalid icon name!')
  }
  return (
    <CustomIcon
      isHidden={props.color === 'transparent'}
      source={name === 'search' ? 'magnify' : 'translate'}
      {...props}
    />
  )
}

const CustomHeaderButton = (props: HeaderButtonProps) => (
  <HeaderButton {...props} IconComponent={HeaderIcon} iconSize={24} role='button' />
)

const CustomHeaderButtons = ({ items }: { items: ReactNode[] }): ReactElement => (
  <StyledHeaderContainer>
    <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>{items}</HeaderButtons>
  </StyledHeaderContainer>
)

export default CustomHeaderButtons
