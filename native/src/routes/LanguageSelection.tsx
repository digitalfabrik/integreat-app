import { shouldPolyfill } from '@formatjs/intl-displaynames/should-polyfill'
import '@formatjs/intl-locale/polyfill'
import React, { ReactElement, useCallback, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'
import { Button } from 'react-native-paper'
import styled from 'styled-components/native'

import { filterLanguages, LanguagesRouteType } from 'shared'
import { useLoadAsync } from 'shared/api'
import { config } from 'translations'

import LanguageNotAvailableMessage from '../components/LanguageNotAvailableMessage'
import SearchInput from '../components/SearchInput'
import Selector from '../components/Selector'
import { SimpleAlertDialog } from '../components/base/AlertDialog'
import Text from '../components/base/Text'
import { NavigationProps, RouteProps } from '../constants/NavigationTypes'
import { AppContext } from '../contexts/AppContext'
import SelectorItemModel from '../models/SelectorItemModel'
import importDisplayNamesPackage from '../utils/importDisplayNamesPackage'

// https://formatjs.github.io/docs/polyfills/intl-displaynames/#dynamic-import--capability-detection
const loadPolyfillIfNeeded = async (locale: string): Promise<void> => {
  const unsupportedLocale = shouldPolyfill(locale)
  if (unsupportedLocale === undefined) {
    return
  }
  await import('@formatjs/intl-displaynames/polyfill-force')
  await importDisplayNamesPackage(locale)
  await importDisplayNamesPackage(config.sourceLanguage)
}

const Wrapper = styled.ScrollView`
  background-color: ${props => props.theme.colors.background};
`

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    gap: 4,
  },
  horizontalMargin: {
    marginHorizontal: 16,
    marginTop: 8,
  },
})

type LanguageSelectionProps = {
  route: RouteProps<LanguagesRouteType>
  navigation: NavigationProps<LanguagesRouteType>
}

const LanguageSelection = ({ navigation, route }: LanguageSelectionProps): ReactElement => {
  const { languages, availableLanguages, previousRouteType, slug } = route.params
  const { languageCode, changeLanguageCode } = useContext(AppContext)
  const { loading } = useLoadAsync(useCallback(() => loadPolyfillIfNeeded(languageCode), [languageCode]))
  const [query, setQuery] = useState('')
  const [alertDialogTitle, setAlertDialogTitle] = useState<string | null>(null)
  const { t } = useTranslation('layout')

  const currentLanguage = languages.find(lang => lang.code === languageCode)
  const filteredLanguages = loading ? languages : filterLanguages(languages, query, languageCode, config.sourceLanguage)

  const userLanguageNames = !loading ? new Intl.DisplayNames([languageCode], { type: 'language' }) : null

  const selectorItems = filteredLanguages.map(({ code, name }) => {
    const isLanguageAvailable = availableLanguages.includes(code)
    return new SelectorItemModel({
      code,
      name,
      enabled: isLanguageAvailable,
      accessibilityLabel: userLanguageNames?.of(code),
      onPress: isLanguageAvailable
        ? () => {
            if (code !== languageCode) {
              changeLanguageCode(code)
            }
            navigation.goBack()
          }
        : () => setAlertDialogTitle(t('noTranslation')),
    })
  })

  const closeAlertDialog = () => setAlertDialogTitle(null)

  return (
    <>
      <Wrapper contentContainerStyle={styles.contentContainer}>
        <SearchInput
          setValue={setQuery}
          value={query}
          placeholderText={currentLanguage?.name}
          style={styles.horizontalMargin}
        />
        <Selector selectedItemCode={languageCode} items={selectorItems} />
        <Button
          mode='outlined'
          onPress={() => setAlertDialogTitle(t('languageNotFoundQuestion'))}
          style={styles.horizontalMargin}>
          {t('languageNotFoundQuestion')}
        </Button>
      </Wrapper>
      <SimpleAlertDialog
        visible={!!alertDialogTitle}
        close={closeAlertDialog}
        title={<Text variant='subtitle1'>{alertDialogTitle}</Text>}>
        <LanguageNotAvailableMessage
          navigation={navigation}
          previousRouteType={previousRouteType}
          slug={slug}
          close={closeAlertDialog}
        />
      </SimpleAlertDialog>
    </>
  )
}

export default LanguageSelection
