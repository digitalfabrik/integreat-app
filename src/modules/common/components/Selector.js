// @flow

import * as React from 'react'

import SelectorItemModel from '../models/SelectorItemModel'
import styled, { css } from 'styled-components/native'
import { TouchableHighlight } from 'react-native'

type PropsType = {
  verticalLayout: boolean,
  closeDropDownCallback?: () => void,
  items: Array<SelectorItemModel>,
  activeItemCode?: string
}

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

/**
 * Displays a Selector showing different items
 */
class Selector extends React.Component<PropsType> {
  getItems (): React.Node {
    const {items, activeItemCode} = this.props
    return items.map(item => {
      return (
        <TouchTarget key={item.code} onPress={item.onPress}>
          <ActiveElement selected={item.code === activeItemCode}>
            <Element>{item.name}</Element>
          </ActiveElement>
        </TouchTarget>
      )
    })
  }

  render () {
    return (
      <Wrapper vertical={this.props.verticalLayout}>
        {this.getItems()}
      </Wrapper>
    )
  }
}

export default Selector
