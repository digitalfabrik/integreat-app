import React, { ReactElement } from 'react'
import { List, TouchableRipple } from 'react-native-paper'
import { DefaultTheme, useTheme } from 'styled-components/native'

import SelectorItemModel from '../models/SelectorItemModel'
import Text from './base/Text'

const getBackgroundColor = (selected: boolean, theme: DefaultTheme): string => {
  if (selected) {
    return theme.dark ? theme.colors.surfaceVariant : theme.colors.tertiaryContainer
  }
  return theme.dark ? theme.colors.surface : ''
}

type SelectorItemProps = {
  model: SelectorItemModel
  selected: boolean
}

const SelectorItem = ({
  model: { name, code, enabled, onPress, accessibilityLabel },
  selected,
}: SelectorItemProps): ReactElement => {
  const theme = useTheme()
  const item = (
    <List.Item
      style={{ backgroundColor: getBackgroundColor(selected, theme) }}
      containerStyle={{ height: 40 }}
      importantForAccessibility='no'
      title={
        <Text
          variant='body1'
          style={{
            fontSize: 20,
            fontWeight: selected ? '700' : '400',
            color: enabled || selected ? theme.colors.onSurface : theme.colors.onSurfaceDisabled,
            textAlign: 'center',
          }}>
          {name}
        </Text>
      }
    />
  )

  return (
    <TouchableRipple
      borderless
      key={code}
      onPress={onPress}
      accessibilityLabel={accessibilityLabel ?? name}
      role='button'
      style={{ width: '100%' }}>
      {item}
    </TouchableRipple>
  )
}

export default SelectorItem
