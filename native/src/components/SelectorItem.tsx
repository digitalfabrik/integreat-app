import React, { ReactElement } from 'react'
import { DefaultTheme, List, TouchableRipple } from 'react-native-paper'
import styled, { useTheme } from 'styled-components/native'

import dimensions from '../constants/dimensions'
import SelectorItemModel from '../models/SelectorItemModel'
import Text from './base/Text'

const getBackgroundColor = (selected: boolean, theme: typeof DefaultTheme): string => {
  if (selected) {
    return theme.dark ? theme.colors.surfaceVariant : theme.colors.tertiaryContainer
  }
  return theme.dark ? theme.colors.surface : ''
}

const StyledListItem = styled(List.Item)<{ selected: boolean }>`
  height: ${dimensions.headerHeight}px;
  background-color: ${props => getBackgroundColor(props.selected, props.theme as typeof DefaultTheme)};
`

type SelectorItemProps = {
  model: SelectorItemModel
  selected: boolean
}

const SelectorItem = ({ model: { name, code, enabled, onPress }, selected }: SelectorItemProps): ReactElement => {
  const theme = useTheme()
  const item = (
    <StyledListItem
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
      selected={selected}
    />
  )

  if (enabled || selected) {
    return (
      <TouchableRipple borderless key={code} onPress={onPress} role='button' style={{ width: '100%' }}>
        {item}
      </TouchableRipple>
    )
  }

  return item
}

export default SelectorItem
