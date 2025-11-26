import React, { ReactElement, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { ColorValue } from 'react-native'
import {
  defaultOnOverflowMenuPress,
  HeaderButton,
  HeaderButtonProps,
  HeaderButtons,
  OnOverflowMenuPressParams,
  OverflowMenu,
} from 'react-navigation-header-buttons'
import styled from 'styled-components/native'

import Icon from './base/Icon'

const StyledHeaderContainer = styled.View`
  margin: 0 10px;
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
  return <Icon source={name === 'search' ? 'magnify' : 'translate'} {...props} />
}

const CustomHeaderButton = (props: HeaderButtonProps) => (
  <HeaderButton {...props} IconComponent={HeaderIcon} iconSize={24} role='button' />
)

// Adjust cancel label for ios overflow menu of HeaderButtons
const onOverflowMenuPress = (cancelButtonLabel: string) => (props: OnOverflowMenuPressParams) =>
  defaultOnOverflowMenuPress({
    ...props,
    cancelButtonLabel,
  })

const CustomHeaderButtons = (props: {
  cancelLabel: string
  items: ReactNode[]
  overflowItems: ReactNode[]
}): ReactElement => {
  const { cancelLabel, items, overflowItems } = props
  const { t } = useTranslation('common')
  return (
    <StyledHeaderContainer>
      <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        {items}
        <OverflowMenu
          onPress={onOverflowMenuPress(cancelLabel)}
          accessibilityLabel={t('moreOptions')}
          OverflowIcon={<Icon source='dots-vertical' />}>
          {overflowItems}
        </OverflowMenu>
      </HeaderButtons>
    </StyledHeaderContainer>
  )
}

export default CustomHeaderButtons
