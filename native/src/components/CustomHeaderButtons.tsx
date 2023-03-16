import React, { ReactElement, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { ImageStyle, StyleProp } from 'react-native'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import {
  defaultOnOverflowMenuPress,
  HeaderButton,
  HeaderButtons,
  OnOverflowMenuPressParams,
  OverflowMenu,
} from 'react-navigation-header-buttons'
import { useTheme } from 'styled-components'

import { LanguageIcon, SearchIcon } from '../assets'
import { isRTL } from '../constants/contentDirection'
import SimpleImage from './SimpleImage'

const Icon = (props: { name: string; style: StyleProp<ImageStyle> }): ReactElement => {
  const { name } = props
  if (name === 'search') {
    return <SimpleImage {...props} source={SearchIcon} style={style}/>
  }
  if (name === 'language') {
    const { style } = props
    return (
      <SimpleImage
        {...props}
        source={LanguageIcon}
        style={{
          ...(style as ImageStyle),
          transform: [
            {
              scaleX: isRTL() ? -1 : 1,
            },
          ],
        }}
      />
    )
  }
  return <MaterialIcon {...props} name={name} />
}
const CustomHeaderButton = (props: {
  disabled: boolean
  title: string
  onPress: () => void
  getButtonElement: () => ReactNode
}) => <HeaderButton {...props} IconComponent={Icon} iconSize={23} color='black' />

// Adjust cancel label for ios overflow menu of HeaderButtons
const onOverflowMenuPress = (cancelButtonLabel: string) => (props: OnOverflowMenuPressParams) =>
  defaultOnOverflowMenuPress({
    ...props,
    cancelButtonLabel,
  })

const CustomHeaderButtons = (props: {
  cancelLabel: string
  items: Array<ReactNode>
  overflowItems: Array<ReactNode>
}): ReactElement => {
  const { cancelLabel, items, overflowItems } = props
  const theme = useTheme()
  const { t } = useTranslation('common')
  return (
    <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
      {items}
      <OverflowMenu
        onPress={onOverflowMenuPress(cancelLabel)}
        accessibilityLabel={t('moreOptions')}
        OverflowIcon={<MaterialIcon name='more-vert' size={23} color={theme.colors.textColor} />}>
        {overflowItems}
      </OverflowMenu>
    </HeaderButtons>
  )
}

export default CustomHeaderButtons
