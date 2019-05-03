// @flow

import * as React from 'react'

import SelectorItemModel from '../models/SelectorItemModel'
import styled, { css } from 'styled-components/native'
import { TouchableHighlight } from 'react-native'
import type { ThemeType } from '../../../modules/theme/constants/theme'

const Element = styled.Text`
  height: ${props => props.theme.dimensions.headerHeight}px;
  width: 100%;
  font-size: 20px;
  line-height: ${props => props.theme.dimensions.headerHeight}px;
  text-align: center;
`

export const TouchTarget = styled(TouchableHighlight)`
 width: 100%;
`

export const ActiveElement = styled(Element)`
  font-weight: 700;
  color: ${props => props.theme.colors.textColor};
  background-color: ${props => props.theme.colors.backgroundColor};
  ${props => props.selected && `background-color: ${props.theme.colors.backgroundAccentColor}`};
`

export const InactiveElement = styled(Element)`
  color: ${props => props.theme.colors.textSecondaryColor};
`

export const Wrapper = styled.View`
  display: flex;
  width: 100%;
  flex-flow: row wrap;
  justify-content: center;
  color: ${props => props.theme.colors.textColor};
  text-align: center;

  ${props => props.vertical && css`
    flex-flow: column;
    align-items: center;
  `}
`

type PropsType = {
  verticalLayout: boolean,
  closeDropDownCallback?: () => void,
  items: Array<SelectorItemModel>,
  selectedItemCode: string | null,
  theme: ThemeType
}

/**
 * Displays a Selector showing different items
 */
class Selector extends React.Component<PropsType> {
  getItems (): React.Node {
    const {items, selectedItemCode, theme} = this.props
    return items.map(item => {
      const isSelected = item.code === selectedItemCode
      if (item.active || isSelected) {
        return (
          <TouchTarget key={item.code} onPress={item.onPress} theme={theme}>
            <ActiveElement selected={isSelected} theme={theme}>
              <Element theme={theme}>{item.name}</Element>
            </ActiveElement>
          </TouchTarget>
        )
      }
      return (
        <InactiveElement key={item.code} theme={theme}>
          <Element theme={theme}>{item.name}</Element>
        </InactiveElement>
      )
    })
  }

  render () {
    return (
      <Wrapper theme={this.props.theme} vertical={this.props.verticalLayout}>
        {this.getItems()}
      </Wrapper>
    )
  }
}

export default Selector
