// @flow

import React from 'react'
import SelectorItemModel from '../../../common/models/SelectorItemModel'
import HeaderDropDown from './HeaderDropDown'
import Selector from '../../../common/components/Selector'
import { translate } from 'react-i18next'
import languageIcon from '../../assets/language-icon.svg'
import { InactiveImage } from './HeaderLanguageSelectorItem.styles'
import type { TFunction } from 'react-i18next'
import ReactTooltip from 'react-tooltip'

type PropsType = {
  selectorItems: Array<SelectorItemModel>,
  activeItemCode: string,
  t: TFunction
}

class HeaderLanguageSelectorItem extends React.Component<PropsType> {
  componentDidMount () {
    /* https://www.npmjs.com/package/react-tooltip#1-using-tooltip-within-the-modal-eg-react-modal- */
    ReactTooltip.rebuild()
  }

  componentDidUpdate () {
    /* https://www.npmjs.com/package/react-tooltip#1-using-tooltip-within-the-modal-eg-react-modal- */
    ReactTooltip.rebuild()
  }

  render () {
    const {selectorItems, activeItemCode, t} = this.props

    return selectorItems && selectorItems.length > 0
      ? <HeaderDropDown iconSrc={languageIcon}>
        <Selector verticalLayout={false}
                  items={selectorItems}
                  activeItemCode={activeItemCode}
                  inactiveItemTooltip={t('noTranslation')} />
      </HeaderDropDown>
      : <span>
        <InactiveImage data-tip={t('noLanguages')} src={languageIcon} data-place='bottom' />
      </span>
  }
}

export default translate('layout')(HeaderLanguageSelectorItem)
