// @flow

import React from 'react'
import SelectorItemModel from '../../common/models/SelectorItemModel'
import HeaderActionItemDropDown from './HeaderActionItemDropDown'
import Selector from '../../common/components/Selector'
import { withTranslation, type TFunction } from 'react-i18next'
import languageIcon from '../assets/language-icon.svg'
import ReactTooltip from 'react-tooltip'
import HeaderActionBarItemLink from './HeaderActionItemLink'
import type { ThemeType } from '../../theme/constants/theme'

type PropsType = {|
  selectorItems: Array<SelectorItemModel>,
  activeItemCode: string,
  theme: ThemeType,
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
    const { selectorItems, activeItemCode, t, theme } = this.props
    const noLanguagesHint = t('noLanguages')

    return selectorItems && selectorItems.length > 0
      ? <HeaderActionItemDropDown theme={theme} iconSrc={languageIcon} text={t('changeLanguage')}>
        {closeDropDown => <Selector
          closeDropDown={closeDropDown}
          verticalLayout={false}
          items={selectorItems}
          activeItemCode={activeItemCode}
          disabledItemTooltip={t('noTranslation')} />}
      </HeaderActionItemDropDown>
      : <HeaderActionBarItemLink text={noLanguagesHint} iconSrc={languageIcon} />
  }
}

export default withTranslation<PropsType>('layout')(HeaderLanguageSelectorItem)
