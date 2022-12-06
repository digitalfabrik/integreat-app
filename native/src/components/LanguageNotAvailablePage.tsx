import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { RefreshControl, Text } from 'react-native'
import styled from 'styled-components/native'

import { fromError, LanguageModel } from 'api-client'

import useCityAppContext from '../hooks/useCityAppContext'
import useLoadLanguages from '../hooks/useLoadLanguages'
import SelectorItemModel from '../models/SelectorItemModel'
import Caption from './Caption'
import Failure from './Failure'
import LayoutedScrollView from './LayoutedScrollView'
import Selector from './Selector'

const Wrapper = styled.ScrollView`
  background-color: ${props => props.theme.colors.backgroundColor};
`

type LanguageNotAvailablePageProps = {
  availableLanguages?: LanguageModel[]
  refresh?: () => void
}

const LanguageNotAvailablePage = ({ availableLanguages, refresh }: LanguageNotAvailablePageProps): ReactElement => {
  const { cityCode, changeLanguageCode } = useCityAppContext()
  const { data, error, refresh: refreshLanguages, loading } = useLoadLanguages({ cityCode })
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
    <LayoutedScrollView
      refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh ?? refreshLanguages} />}>
      {items ? (
        <Wrapper contentContainerStyle={{ alignItems: 'center' }}>
          <Caption title={t('languageNotAvailable')} />
          <Text>{t('chooseALanguage')}</Text>
          <Selector items={items} selectedItemCode={null} />
        </Wrapper>
      ) : (
        !loading && <Failure code={fromError(error)} />
      )}
    </LayoutedScrollView>
  )
}

export default LanguageNotAvailablePage
