// @flow

import * as React from 'react'

import SelectorItemModel from '../models/SelectorItemModel'
import ReactTooltip from 'react-tooltip'
import styled, { css } from 'styled-components'
import Link from 'redux-first-router-link'

const Element = styled(Link)`
  ${props => props.theme.helpers.removeLinkHighlighting};
  height: ${props => props.theme.dimensions.web.headerHeightLarge}px;
  min-width: 90px;
  flex: 1 1 auto;
  padding: 0 5px;
  font-size: 1.2em;
  line-height: ${props => props.theme.dimensions.web.headerHeightLarge}px;
  text-align: center;
  white-space: nowrap;
  border-radius: 30px;
  transition: background-color 0.2s, border-radius 0.2s;
  user-select: none;

  @media ${props => props.theme.dimensions.web.smallViewport} {
    height: ${props => props.theme.dimensions.web.headerHeightSmall}px;
    min-width: 70px;
    flex: 1 1 auto;
    font-size: 1em;
    line-height: ${props => props.theme.dimensions.web.headerHeightSmall}px;
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
  componentDidMount () {
    /* https://www.npmjs.com/package/react-tooltip#1-using-tooltip-within-the-modal-eg-react-modal- */
    ReactTooltip.rebuild()
  }

  componentDidUpdate () {
    /* https://www.npmjs.com/package/react-tooltip#1-using-tooltip-within-the-modal-eg-react-modal- */
    ReactTooltip.rebuild()
  }

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
          <DisabledElement data-tip={disabledItemTooltip} data-event='mouseover' data-event-off='click mouseout' key={item.code}>
            {item.name}
          </DisabledElement>
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
