// @flow

import * as React from 'react'
import styled from 'styled-components/native'
import type { ThemeType } from '../../theme/constants/theme'
import { LanguageModel } from '@integreat-app/integreat-api-client'
import Selector from './Selector'
import SelectorItemModel from '../models/SelectorItemModel'
import { Text } from 'react-native'
import Caption from './Caption'
import { type TFunction } from 'react-i18next'

const Wrapper = styled.View`
  position: absolute;  
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${props => props.theme.colors.backgroundColor};
  align-items: center;
`

type PropsType = {
  theme: ThemeType,
  city: string,
  currentLanguage: string,
  languages: Array<LanguageModel>,
  changeLanguage: (city: string, newLanguage: string) => void,
  t: TFunction
}

class LanguageNotAvailablePage extends React.Component<PropsType> {
  onPress = (model: LanguageModel) => {
    const { changeLanguage, city } = this.props
    changeLanguage(city, model.code)
  }

  render () {
    const {t, languages, theme} = this.props
    return <Wrapper theme={theme}>
      <Caption title={t('languageNotAvailable')} theme={theme} />
      <Text>{t('chooseALanguage')}</Text>
      <Selector verticalLayout
                items={languages.map(languageModel => new SelectorItemModel({
                  code: languageModel.code,
                  name: languageModel.name,
                  enabled: true,
                  onPress: () => this.onPress(languageModel)
                }))}
                selectedItemCode={null}
                theme={theme} />
    </Wrapper>
  }
}

export default LanguageNotAvailablePage
