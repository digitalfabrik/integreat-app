import React, { ReactElement } from 'react'
import { List } from 'react-native-paper'
import styled from 'styled-components/native'

import dimensions from '../constants/dimensions'
import SelectorItemModel from '../models/SelectorItemModel'
import Pressable from './base/Pressable'

export const TouchTarget = styled(Pressable)`
  width: 100%;
`

const StyledListItem = styled(List.Item)<{ selected: boolean }>`
  height: ${dimensions.headerHeight}px;
  background-color: ${props => (props.selected ? props.theme.colors.tertiaryContainer : '')};
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
