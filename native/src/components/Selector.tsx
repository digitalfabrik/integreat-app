import * as React from 'react'
import { ReactNode } from 'react'
import SelectorItemModel from '../models/SelectorItemModel'
import styled from 'styled-components/native'
import { css } from 'styled-components'
import { TouchableHighlight } from 'react-native'
import dimensions from '..//constants/dimensions'
import { ThemeType } from 'build-configs'

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
export const TouchTarget = styled(TouchableHighlight)`
  width: 100%;
`
type WrapperPropsType = {
  vertical: boolean
  children: React.ReactNode
  theme: ThemeType
}
export const Wrapper = styled.View<WrapperPropsType>`
  display: flex;
  width: 100%;
  flex-flow: row wrap;
  justify-content: center;
  color: ${props => props.theme.colors.textColor};
  text-align: center;

  ${props =>
    props.vertical
      ? css`
          flex-flow: column;
          align-items: center;
        `
      : ''}
`
type PropsType = {
  verticalLayout: boolean
  closeDropDownCallback?: () => void
  items: Array<SelectorItemModel>
  selectedItemCode: string | null
  theme: ThemeType
}

/**
 * Displays a Selector showing different items
 */

class Selector extends React.Component<PropsType> {
  getItems(): React.ReactNode {
    const { items, selectedItemCode, theme } = this.props
    return items.map(item => {
      const isSelected = item.code === selectedItemCode

      if (item.enabled || isSelected) {
        return (
          <TouchTarget key={item.code} onPress={item.onPress}>
            <ItemWrapper selected={isSelected} theme={theme}>
              <Element theme={theme} enabled>
                {item.name}
              </Element>
            </ItemWrapper>
          </TouchTarget>
        )
      }

      return (
        <ItemWrapper key={item.code} selected={isSelected} theme={theme}>
          <Element theme={theme} enabled={false}>
            {item.name}
          </Element>
        </ItemWrapper>
      )
    })
  }

  render(): ReactNode {
    return (
      <Wrapper theme={this.props.theme} vertical={this.props.verticalLayout}>
        {this.getItems()}
      </Wrapper>
    )
  }
}

export default Selector
