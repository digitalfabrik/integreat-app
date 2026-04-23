import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { RefreshControl } from 'react-native'
import styled from 'styled-components/native'

import { fromError, LanguageModel } from 'shared/api'

import useLoadRegions from '../hooks/useLoadRegions'
import useRegionAppContext from '../hooks/useRegionAppContext'
import SelectorItemModel from '../models/SelectorItemModel'
import Caption from './Caption'
import Failure from './Failure'
import LayoutedScrollView from './LayoutedScrollView'
import Selector from './Selector'

const Wrapper = styled.ScrollView`
  background-color: ${props => props.theme.colors.background};
`

type LanguageNotAvailablePageProps = {
  availableLanguages?: LanguageModel[]
  refresh?: () => void
}

const LanguageNotAvailablePage = ({ availableLanguages, refresh }: LanguageNotAvailablePageProps): ReactElement => {
  const { cityCode, changeLanguageCode } = useRegionAppContext()
  const { data: cities, error, refresh: refreshCities, loading } = useLoadRegions()
  const languages = cities?.find(it => it.code === cityCode)?.languages
  const { t } = useTranslation('error')

  const items = (availableLanguages ?? languages)?.map(
    ({ code, name }: LanguageModel) =>
      new SelectorItemModel({
        code,
        name,
        enabled: true,
        onPress: () => {
          changeLanguageCode(code)
        },
      }),
  )

  return (
    <LayoutedScrollView refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh ?? refreshCities} />}>
      {items ? (
        <Wrapper contentContainerStyle={{ alignItems: 'center' }}>
          <Caption title={t('notFound.language')} />
          <Selector items={items} selectedItemCode={null} />
        </Wrapper>
      ) : (
        !loading && <Failure code={fromError(error)} />
      )}
    </LayoutedScrollView>
  )
}

export default LanguageNotAvailablePage
