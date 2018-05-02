// @flow

import React from 'react'

import SelectorItemModel from '../models/SelectorItemModel'
import { ActiveElement, Wrapper, InactiveElement } from './Selector.styles'
import ReactTooltip from 'react-tooltip'

type Props = {
  verticalLayout: boolean,
  closeDropDownCallback?: () => {},
  items: Array<SelectorItemModel>,
  activeItemCode?: string,
  inactiveItemTooltip: string
}

/**
 * Displays a Selector showing different items
 */
class Selector extends React.Component<Props> {
  componentDidMount () {
    /* https://www.npmjs.com/package/react-tooltip#1-using-tooltip-within-the-modal-eg-react-modal- */
    ReactTooltip.rebuild()
  }

  componentDidUpdate () {
    /* https://www.npmjs.com/package/react-tooltip#1-using-tooltip-within-the-modal-eg-react-modal- */
    ReactTooltip.rebuild()
  }

  getItems () {
    const {items, activeItemCode, closeDropDownCallback, inactiveItemTooltip} = this.props
    return items.map(item => {
      if (item.href) {
        return (
          <ActiveElement key={item.code}
                         onClick={closeDropDownCallback}
                         to={item.href}
                         selected={item.code === activeItemCode}>
            {item.name}
          </ActiveElement>
        )
      } else {
        return (
          <InactiveElement data-tip={inactiveItemTooltip} key={item.code}>
            {item.name}
          </InactiveElement>
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
