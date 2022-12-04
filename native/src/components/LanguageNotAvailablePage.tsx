import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Text } from 'react-native'
import styled from 'styled-components/native'

import { LanguageModel } from 'api-client'

import useCityAppContext from '../hooks/useCityAppContext'
import useLoadLanguages from '../hooks/useLoadLanguages'
import SelectorItemModel from '../models/SelectorItemModel'
import LoadingErrorHandler from '../routes/LoadingErrorHandler'
import Caption from './Caption'
import Selector from './Selector'

const Wrapper = styled.ScrollView`
  background-color: ${props => props.theme.colors.backgroundColor};
`

type LanguageNotAvailablePageProps = {
  availableLanguages?: LanguageModel[]
}

const LanguageNotAvailablePage = ({ availableLanguages }: LanguageNotAvailablePageProps): ReactElement => {
  const { cityCode, changeLanguageCode } = useCityAppContext()
  const { data, ...response } = useLoadLanguages({ cityCode })
  const { t } = useTranslation('common')

  const items = (availableLanguages ?? data)?.map(
    ({ code, name }) =>
      new SelectorItemModel({
        code,
        name,
        enabled: true,
        onPress: () => {
          changeLanguageCode(code)
        },
      })
  )

  return (
    <LoadingErrorHandler {...response} scrollView>
      {items && (
        <Wrapper contentContainerStyle={{ alignItems: 'center' }}>
          <Caption title={t('languageNotAvailable')} />
          <Text>{t('chooseALanguage')}</Text>
          <Selector items={items} selectedItemCode={null} />
        </Wrapper>
      )}
    </LoadingErrorHandler>
  )
}

export default LanguageNotAvailablePage
