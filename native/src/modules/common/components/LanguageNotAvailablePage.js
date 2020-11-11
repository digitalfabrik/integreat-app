// @flow

import * as React from 'react'
import styled from 'styled-components/native'
import { type StyledComponent } from 'styled-components'
import type { ThemeType } from '../../theme/constants'
import { LanguageModel } from 'api-client'
import Selector from './Selector'
import SelectorItemModel from '../models/SelectorItemModel'
import { Text } from 'react-native'
import Caption from './Caption'
import { type TFunction } from 'react-i18next'

const Wrapper: StyledComponent<{}, ThemeType, *> = styled.View`
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
  languages: Array<LanguageModel>,
  changeLanguage: (newLanguage: string) => void,
  t: TFunction
}

class LanguageNotAvailablePage extends React.Component<PropsType> {
  onPress = (model: LanguageModel) => {
    this.props.changeLanguage(model.code)
  }

  render () {
    const { t, languages, theme } = this.props
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
