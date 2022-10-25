import React, { ReactElement } from 'react'
import { TouchableHighlight } from 'react-native'
import styled from 'styled-components/native'

import dimensions from '../constants/dimensions'
import SelectorItemModel from '../models/SelectorItemModel'

export const TouchTarget = styled(TouchableHighlight)`
  width: 100%;
`

const ItemWrapper = styled.View<{ selected: boolean }>`
  justify-content: center;
  align-items: center;
  background-color: ${props => props.theme.colors.backgroundColor};
  ${props => (props.selected ? `background-color: ${props.theme.colors.backgroundAccentColor}` : '')};
  height: ${dimensions.headerHeight}px;
`

const Element = styled.Text<{ enabled: boolean }>`
  font-size: 20px;
  ${props => (props.enabled ? 'font-weight: 700' : '')};
  color: ${props => (props.enabled ? props.theme.colors.textColor : props.theme.colors.textSecondaryColor)}};
`

type SelectorItemProps = {
  model: SelectorItemModel
  selected: boolean
}

const SelectorItem = ({ model: { name, code, enabled, onPress }, selected }: SelectorItemProps): ReactElement => {
  if (enabled || selected) {
    return (
      <TouchTarget key={code} onPress={onPress}>
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
