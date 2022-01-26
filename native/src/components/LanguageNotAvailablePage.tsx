import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Text } from 'react-native'
import styled from 'styled-components/native'

import { LanguageModel } from 'api-client'

import SelectorItemModel from '../models/SelectorItemModel'
import Caption from './Caption'
import Selector from './Selector'

const Wrapper = styled.View`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${props => props.theme.colors.backgroundColor};
  align-items: center;
`
export type PropsType = {
  languages: Array<LanguageModel>
  changeLanguage: (newLanguage: string) => void
}

const LanguageNotAvailablePage = ({ languages, changeLanguage }: PropsType): ReactElement => {
  const { t } = useTranslation('common')
  return (
    <Wrapper>
      <Caption title={t('languageNotAvailable')} />
      <Text>{t('chooseALanguage')}</Text>
      <Selector
        verticalLayout
        items={languages.map(
          languageModel =>
            new SelectorItemModel({
              code: languageModel.code,
              name: languageModel.name,
              enabled: true,
              onPress: () => changeLanguage(languageModel.code)
            })
        )}
        selectedItemCode={null}
      />
    </Wrapper>
  )
}

export default LanguageNotAvailablePage
