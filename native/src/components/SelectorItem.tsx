import React, { ReactElement } from 'react'
import { DefaultTheme, List } from 'react-native-paper'
import styled from 'styled-components/native'

import dimensions from '../constants/dimensions'
import SelectorItemModel from '../models/SelectorItemModel'
import Pressable from './base/Pressable'

export const TouchTarget = styled(Pressable)`
  width: 100%;
`

const getBackgroundColor = (selected: boolean, theme: typeof DefaultTheme): string => {
  if (!selected && !theme.dark) {
    return ''
  }
  if (selected && !theme.dark) {
    return theme.colors.tertiaryContainer
  }
  if (selected && theme.dark) {
    return theme.colors.surfaceVariant
  }
  return theme.colors.surface
}

const StyledListItem = styled(List.Item)<{ selected: boolean }>`
  height: ${dimensions.headerHeight}px;
  background-color: ${props => getBackgroundColor(props.selected, props.theme as typeof DefaultTheme)};
`

const Element = styled.Text<{ selected: boolean; enabled?: boolean }>`
  font-size: 20px;
  font-weight: ${props => (props.selected ? '700' : '400')};
  color: ${props =>
    props.enabled || props.selected ? props.theme.colors.onSurface : props.theme.colors.onSurfaceDisabled};
  text-align: center;
`

type SelectorItemProps = {
  model: SelectorItemModel
  selected: boolean
}

const SelectorItem = ({ model: { name, code, enabled, onPress }, selected }: SelectorItemProps): ReactElement => {
  const item = (
    <StyledListItem
      title={
        <Element selected={selected} enabled={enabled}>
          {name}
        </Element>
      }
      selected={selected}
    />
  )

  if (enabled || selected) {
    return (
      <TouchTarget key={code} onPress={onPress} role='button'>
        {item}
      </TouchTarget>
    )
  }

  return item
}

export default SelectorItem
