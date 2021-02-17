// @flow

import * as React from 'react'
import styled from 'styled-components/native'
import { type StyledComponent } from 'styled-components'
import type { ThemeType } from 'build-configs/ThemeType'
import { LanguageModel } from 'api-client'
import Selector from '../../../modules/common/components/Selector'
import SelectorItemModel from '../../../modules/common/models/SelectorItemModel'
import { InteractionManager } from 'react-native'
import type { TFunction } from 'react-i18next'
import type {
  NavigationPropType,
  RoutePropType
} from '../../../modules/app/constants/NavigationTypes'
import type { ChangeLanguageModalRouteType, NewsType } from 'api-client/src/routes'

const Wrapper: StyledComponent<{||}, ThemeType, *> = styled.ScrollView`
  background-color: ${props => props.theme.colors.backgroundColor};
`

type PropsType = {|
  theme: ThemeType,
  currentLanguage: string,
  languages: Array<LanguageModel>,
  availableLanguages: Array<string>,
  changeLanguage: (newLanguage: string, newsType: ?NewsType) => void,
  route: RoutePropType<ChangeLanguageModalRouteType>,
  navigation: NavigationPropType<ChangeLanguageModalRouteType>,
  newsType: ?NewsType,
  t: TFunction
|}

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
