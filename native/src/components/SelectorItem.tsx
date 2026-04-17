import React, { ReactElement } from 'react'
import { StyleSheet, View } from 'react-native'
import { List, TouchableRipple } from 'react-native-paper'
import { DefaultTheme, useTheme } from 'styled-components/native'

import SelectorItemModel from '../models/SelectorItemModel'
import Icon from './base/Icon'
import Text from './base/Text'

const INFO_ICON_SIZE = 24

const styles = StyleSheet.create({
  listItem: {
    width: 250,
    alignSelf: 'center',
  },
  listItemContainer: {
    height: 40,
  },
  listItemTitle: {
    textAlign: 'center',
  },
  titleView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
  },
  infoIconWrapper: {
    marginLeft: 4,
  },
})

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
  const infoIcon =
    !enabled && !selected ? (
      <View style={styles.infoIconWrapper}>
        <Icon
          source='information-outline'
          size={INFO_ICON_SIZE}
          color={theme.colors.onSurfaceDisabled}
          label='informationIcon'
        />
      </View>
    ) : null

  return (
    <TouchableRipple
      borderless
      key={code}
      onPress={onPress}
      accessibilityLabel={accessibilityLabel ?? name}
      role='button'
      style={{ width: '100%', backgroundColor: getBackgroundColor(selected, theme) }}>
      <List.Item
        style={styles.listItem}
        containerStyle={styles.listItemContainer}
        importantForAccessibility='no'
        titleStyle={styles.listItemTitle}
        title={
          <View style={styles.titleView}>
            <Text
              variant='body1'
              style={[
                styles.text,
                {
                  fontWeight: selected ? '700' : '400',
                  color: enabled || selected ? theme.colors.onSurface : theme.colors.onSurfaceDisabled,
                },
              ]}>
              {name}
            </Text>
            {infoIcon}
          </View>
        }
      />
    </TouchableRipple>
  )
}

export default SelectorItem
