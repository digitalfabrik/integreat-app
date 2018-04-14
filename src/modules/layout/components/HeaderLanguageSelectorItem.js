// @flow

import React from 'react'
import SelectorItemModel from '../../common/models/SelectorItemModel'
import HeaderDropDown from './HeaderDropDown'
import Selector from '../../common/components/Selector'
import { translate } from 'react-i18next'
import languageIcon from '../assets/language-icon.svg'
import { InactiveImage, Tooltip } from './HeaderLanguageSelectorItem.styles'

type Props = {
  selectorItems: Array<SelectorItemModel>,
  activeItemCode: string,
  t: string => string
}

class HeaderLanguageSelectorItem extends React.Component<Props> {
  render () {
    const {selectorItems, activeItemCode, t} = this.props

    return selectorItems && selectorItems.length > 0
      ? <HeaderDropDown iconSrc={languageIcon}>
        <Selector verticalLayout={false}
                  items={selectorItems}
                  activeItemCode={activeItemCode} />
      </HeaderDropDown>
      : <span>
          <InactiveImage data-tip={t('noLanguages')} src={languageIcon} />
          <Tooltip effect='solid' delayShow={0} />
        </span>
  }
}

export default translate('layout')(HeaderLanguageSelectorItem)
