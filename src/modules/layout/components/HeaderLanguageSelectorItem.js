// @flow

import React from 'react'
import SelectorItemModel from '../../common/models/SelectorItemModel'
import HeaderDropDown from './HeaderDropDown'
import Selector from '../../common/components/Selector'
import type { TFunction } from 'react-i18next'
import { withTranslation } from 'react-i18next'
import languageIcon from '../assets/language-icon.svg'
import ReactTooltip from 'react-tooltip'

type PropsType = {|
  selectorItems: Array<SelectorItemModel>,
  activeItemCode: string,
  t: TFunction
|}

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
    const { selectorItems, activeItemCode, t } = this.props
    const noLanguagesHint = t('noLanguages')

    return selectorItems && selectorItems.length > 0
      ? <HeaderDropDown iconSrc={languageIcon} text={t('changeLanguage')}>
        <Selector verticalLayout={false}
                  items={selectorItems}
                  activeItemCode={activeItemCode}
                  disabledItemTooltip={t('noTranslation')} />
      </HeaderDropDown>
      : <span>
        <img data-tip={noLanguagesHint} aria-label={noLanguagesHint} src={languageIcon} data-place='bottom' />
      </span>
  }
}

export default withTranslation('layout')(HeaderLanguageSelectorItem)
