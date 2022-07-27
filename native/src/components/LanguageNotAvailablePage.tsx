import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Text } from 'react-native'
import styled from 'styled-components/native'

import { LanguageModel } from 'api-client'

import SelectorItemModel from '../models/SelectorItemModel'
import Caption from './Caption'
import Selector from './Selector'

const Wrapper = styled.ScrollView`
  background-color: ${props => props.theme.colors.backgroundColor};
`

export type PropsType = {
  languages: Array<LanguageModel>
  changeLanguage: (newLanguage: string) => void
}

const LanguageNotAvailablePage = ({ languages, changeLanguage }: PropsType): ReactElement => {
  const { t } = useTranslation('common')
  const selectorItems = languages.map(
    ({ code, name }) =>
      new SelectorItemModel({
        code,
        name,
        enabled: true,
        onPress: () => changeLanguage(code),
      })
  )

  return (
    <Wrapper contentContainerStyle={{ alignItems: 'center' }}>
      <Caption title={t('languageNotAvailable')} />
      <Text>{t('chooseALanguage')}</Text>
      <Selector items={selectorItems} selectedItemCode={null} />
    </Wrapper>
  )
}

export default LanguageNotAvailablePage
