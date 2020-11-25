// @flow

import * as React from 'react'
import styled from 'styled-components/native'
import { type StyledComponent } from 'styled-components'
import type { ThemeType } from '../../../modules/theme/constants'
import { LanguageModel } from 'api-client'
import Selector from '../../../modules/common/components/Selector'
import SelectorItemModel from '../../../modules/common/models/SelectorItemModel'
import { InteractionManager } from 'react-native'
import type { NavigationStackProp } from 'react-navigation-stack'
import type { NewsType } from '../../../modules/app/StateType'

const Wrapper: StyledComponent<{}, ThemeType, *> = styled.ScrollView`
  background-color: ${props => props.theme.colors.backgroundColor};
`

type PropsType = {
  theme: ThemeType,
  currentLanguage: string,
  languages: Array<LanguageModel>,
  availableLanguages: Array<string>,
  changeLanguage: (newLanguage: string, newsType: ?NewsType) => void,
  navigation: NavigationStackProp<*>,
  newsType: ?NewsType
}

class ChangeLanguageModal extends React.Component<PropsType> {
  onPress = (model: LanguageModel) => {
    const { changeLanguage, newsType } = this.props

    this.closeModal()
    InteractionManager.runAfterInteractions(() => {
      changeLanguage(model.code, newsType)
    })
  }

  closeModal = () => { this.props.navigation.goBack() }

  render () {
    const { theme, languages, availableLanguages, currentLanguage } = this.props

    return <Wrapper theme={theme} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
      <Selector theme={theme} selectedItemCode={currentLanguage} verticalLayout
                items={languages.map(languageModel => {
                  const isLanguageAvailable = availableLanguages.includes(languageModel.code)
                  return new SelectorItemModel({
                    code: languageModel.code,
                    name: languageModel.name,
                    enabled: isLanguageAvailable,
                    onPress: () => this.onPress(languageModel)
                  })
                })} />
    </Wrapper>
  }
}

export default ChangeLanguageModal
