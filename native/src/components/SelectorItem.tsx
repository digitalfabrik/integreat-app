import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

import dimensions from '../constants/dimensions'
import SelectorItemModel from '../models/SelectorItemModel'
import Pressable from './base/Pressable'

export const TouchTarget = styled(Pressable)`
  width: 100%;
`

const ItemWrapper = styled.View<{ selected: boolean }>`
  justify-content: center;
  align-items: center;
  background-color: ${props => props.theme.colors.background};
  ${props => (props.selected ? `background-color: ${props.theme.colors.surfaceVariant}` : '')};
  height: ${dimensions.headerHeight}px;
`

const Element = styled.Text<{ enabled: boolean }>`
  font-size: 20px;
  ${props => (props.enabled ? 'font-weight: 700' : '')};
  color: ${props => (props.enabled ? props.theme.colors.onSurface : props.theme.colors.onSurfaceVariant)};
`

type SelectorItemProps = {
  model: SelectorItemModel
  selected: boolean
}

const SelectorItem = ({ model: { name, code, enabled, onPress }, selected }: SelectorItemProps): ReactElement => {
  if (enabled || selected) {
    return (
      <TouchTarget key={code} onPress={onPress} role='button'>
        <ItemWrapper selected={selected}>
          <Element enabled>{name}</Element>
        </ItemWrapper>
      </TouchTarget>
    )
  }

  return (
    <ItemWrapper key={code} selected={selected}>
      <Element enabled={false}>{name}</Element>
    </ItemWrapper>
  )
}

export default SelectorItem
