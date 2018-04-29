// @flow

import React from 'react'

import Tooltip from 'react-tooltip'
import SelectorItemModel from '../models/SelectorItemModel'
import { SelectedElement, ActiveElement, Wrapper, InactiveElement } from './Selector.styles'
import { translate } from 'react-i18next'
import type { I18nTranslate } from '../../../flowTypes'

type Props = {
  verticalLayout: boolean,
  closeDropDownCallback?: () => {},
  items: Array<SelectorItemModel>,
  activeItemCode?: string,
  tooltip: string,
  t: I18nTranslate
}

/**
 * Displays a Selector showing different items
 */
class Selector extends React.Component<Props> {
  getItems () {
    const {items, activeItemCode, closeDropDownCallback, tooltip, t} = this.props
    return items.map(item => {
      if (item.code === activeItemCode) {
        return (
          <SelectedElement key={item.code}
                         onClick={closeDropDownCallback}>
            {item.name}
          </SelectedElement>
        )
      } else if (item.href) {
        return (
          <ActiveElement key={item.code}
                onClick={closeDropDownCallback}
                to={item.href}>
            {item.name}
          </ActiveElement>
        )
      } else {
        return (
          <span data-tip={t(tooltip)}>
            <InactiveElement key={item.code}>
              {item.name}
            </InactiveElement>
            <Tooltip effect='solid' delayShow={0} />
          </span>
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

export default translate('common')(Selector)
