import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { KeyboardAvoidingView, Platform } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import {
  filterRedundantFallbackLanguageResults,
  MAX_SEARCH_RESULTS,
  parseHTML,
  SEARCH_ROUTE,
  SearchRouteType,
  useDebounce,
  useSearch,
} from 'shared'
import { ExtendedPageModel } from 'shared/api'
import { config } from 'translations'

import FeedbackContainer from '../components/FeedbackContainer'
import List from '../components/List'
import SearchHeader from '../components/SearchHeader'
import SearchListItem from '../components/SearchListItem'
import Text from '../components/base/Text'
import { NavigationProps } from '../constants/NavigationTypes'
import useAnnounceSearchResultsIOS from '../hooks/useAnnounceSearchResultsIOS'
import useReportError from '../hooks/useReportError'
import testID from '../testing/testID'

const Wrapper = styled.View`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.onSurface};
`

export type SearchProps = {
  navigation: NavigationProps<SearchRouteType>
  documents: ExtendedPageModel[]
  fallbackLanguageDocuments: ExtendedPageModel[]
  languageCode: string
  cityCode: string
  initialSearchText: string
}

const Search = ({
  navigation,
  documents,
  fallbackLanguageDocuments,
  languageCode,
  cityCode,
  initialSearchText,
}: SearchProps): ReactElement | null => {
  const [query, setQuery] = useState<string>(initialSearchText)
  const { t } = useTranslation('search')
  const theme = useTheme()

  const debouncedQuery = useDebounce(query)
  const contentLanguageReturn = useSearch(documents, debouncedQuery)
  const fallbackLanguageReturn = useSearch(fallbackLanguageDocuments, debouncedQuery)
  const fallbackLanguageResults = filterRedundantFallbackLanguageResults({
    fallbackLanguageResults: fallbackLanguageReturn.data,
    contentLanguageResults: contentLanguageReturn.data,
    fallbackLanguage: config.sourceLanguage,
  })
  const searchResults = contentLanguageReturn.data.concat(fallbackLanguageResults).slice(0, MAX_SEARCH_RESULTS)

  useReportError(contentLanguageReturn.error ?? fallbackLanguageReturn.error)
  useAnnounceSearchResultsIOS(searchResults)

  const renderItem = ({ item }: { item: ExtendedPageModel }) => (
    <SearchListItem
      key={item.path}
      title={item.title}
      contentWithoutHtml={parseHTML(item.content)}
      language={languageCode}
      query={debouncedQuery}
      path={item.path}
    />
  )

  return (
    <Wrapper {...testID('Search-Page')}>
      <SearchHeader navigation={navigation} query={query} onSearchChanged={setQuery} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        {debouncedQuery.length > 0 && (
          <>
            <Text
              variant='body2'
              style={{ margin: 12, marginHorizontal: 20, color: theme.colors.onSurfaceVariant }}
              accessibilityLiveRegion={searchResults.length === 0 ? 'assertive' : 'polite'}>
              {t('searchResultsCount', { count: searchResults.length })}
            </Text>
            <List
              items={searchResults}
              renderItem={renderItem}
              accessibilityLabel={t('searchResultsCount', { count: searchResults.length })}
              style={{ flex: 1 }}
              keyboardShouldPersistTaps='handled'
              noItemsMessage={
                <FeedbackContainer
                  routeType={SEARCH_ROUTE}
                  language={languageCode}
                  cityCode={cityCode}
                  noResults={searchResults.length === 0}
                  query={debouncedQuery}
                />
              }
            />
          </>
        )}
      </KeyboardAvoidingView>
    </Wrapper>
  )
}

export default Search
