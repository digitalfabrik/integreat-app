// @flow

import * as React from 'react'

import SelectorItemModel from '../models/SelectorItemModel'
import styled, { css } from 'styled-components'
import Link from 'redux-first-router-link'
import helpers from '../../theme/constants/helpers'
import dimensions from '../../theme/constants/dimensions'
import Tooltip from './Tooltip'

const Element = styled(Link)`
  ${helpers.removeLinkHighlighting};
  height: ${dimensions.headerHeightLarge}px;
  min-width: 90px;
  flex: 1 1 auto;
  padding: 0 5px;
  font-size: 1.2em;
  line-height: ${dimensions.headerHeightLarge}px;
  text-align: center;
  white-space: nowrap;
  border-radius: 30px;
  transition: background-color 0.2s, border-radius 0.2s;
  user-select: none;

  @media ${dimensions.smallViewport} {
    height: ${dimensions.headerHeightSmall}px;
    min-width: 70px;
    flex: 1 1 auto;
    font-size: 1em;
    line-height: ${dimensions.headerHeightSmall}px;
  }
`

const ActiveElement = styled(Element)`
  color: ${props => props.theme.colors.textColor};
  ${props => props.selected
    ? 'font-weight: 700;'
    : `:hover {
          font-weight: 700;
          border-radius: 0;
        }`}
`

const DisabledElement = styled(Element.withComponent('span'))`
  color: ${props => props.theme.colors.textDisabledColor};
`

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  flex-flow: row wrap;
  justify-content: center;
  color: ${props => props.theme.colors.textColor};
  text-align: center;

  ${props => props.vertical && css`
    flex-flow: column;
    align-items: center;

    & ${Element} {
      flex: 1;
    }
  `}
`

type PropsType = {|
  verticalLayout: boolean,
  closeDropDown?: () => void,
  items: Array<SelectorItemModel>,
  activeItemCode?: string,
  disabledItemTooltip: string
|}

/**
 * Displays a Selector showing different items
 */
class Selector extends React.PureComponent<PropsType> {

  getItems (): React.Node {
    const { items, activeItemCode, closeDropDown, disabledItemTooltip } = this.props
    return items.map(item => {
      if (item.href) {
        return (
          <ActiveElement key={item.code}
                         onClick={closeDropDown}
                         to={item.href}
                         selected={item.code === activeItemCode}>
            {item.name}
          </ActiveElement>
        )
      } else {
        return (
          <Tooltip key={item.code} text={disabledItemTooltip} direction='up'>
            <DisabledElement>
              {item.name}
            </DisabledElement>
          </Tooltip>
        )
      }
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
