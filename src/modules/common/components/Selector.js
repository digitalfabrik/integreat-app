import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'redux-little-router'
import styled, { css } from 'styled-components'

import SelectorItemModel from '../models/SelectorItemModel'

const Element = styled(Link)`
  ${props => props.theme.helpers.removeA};
  height: ${props => props.theme.dimensions.headerHeight};
  min-width: 90px;
  max-width: 120px;
  flex: 1 1 90px;
  color: ${props => props.theme.colors.textSecondaryColor};
  font-size: 1.2em;
  line-height: ${props => props.theme.dimensions.headerHeight};
  text-align: center;
  transition: background-color 0.2s, border-radius 0.2s;
  border-radius: 30px;
  user-select: none;
  
  :hover {
    color: ${props => props.theme.colors.textColor};
    font-weight: 700;
    border-radius: 0;
  }

  @media ${props => props.theme.dimensions.smallViewport} {
      height: ${props => props.theme.dimensions.headerHeightSmall};
      min-width: 70px;
      flex: 1 1 70px;
      font-size: 1em;
      line-height: ${props => props.theme.dimensions.headerHeightSmall};
  }
`

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  flex-flow: row wrap;
  justify-content: center;
  color: var(--text-color);
  text-align: center;
  
  ${props => props.vertical && css`
    flex-flow: column;
    align-items: center;
  
    & ${Element} {
      flex: 1;
    }
  `}
`

const ActiveElement = Element.withComponent('span').extend`
  color: ${props => props.theme.colors.textColor};
  font-weight: 700;
`

/**
 * Displays a Selector showing different items
 */
class Selector extends React.Component {
  static propTypes = {
    verticalLayout: PropTypes.bool,
    closeDropDownCallback: PropTypes.func,
    items: PropTypes.arrayOf(PropTypes.instanceOf(SelectorItemModel)).isRequired,
    /** The code of the item which is currently active **/
    activeItemCode: PropTypes.string.isRequired
  }

  getItems () {
    return this.props.items.map(item => {
      if (item.code === this.props.activeItemCode) {
        return (
          <ActiveElement key={item.code}
                         onClick={this.props.closeDropDownCallback}>
            {item.name}
          </ActiveElement>
        )
      } else {
        return (
          <Element key={item.code}
                   onClick={this.props.closeDropDownCallback}
                   href={item.path}>
            {item.name}
          </Element>
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
