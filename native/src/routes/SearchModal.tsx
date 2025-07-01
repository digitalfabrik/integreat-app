import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { KeyboardAvoidingView, Platform } from 'react-native'
import styled from 'styled-components/native'

import {
  parseHTML,
  SEARCH_FINISHED_SIGNAL_NAME,
  SEARCH_ROUTE,
  useSearch,
  useDebounce,
  MAX_SEARCH_RESULTS,
  filterRedundantFallbackLanguageResults,
} from 'shared'
import { ExtendedPageModel } from 'shared/api'
import { config } from 'translations'

import FeedbackContainer from '../components/FeedbackContainer'
import List from '../components/List'
import SearchHeader from '../components/SearchHeader'
import SearchListItem from '../components/SearchListItem'
import useAnnounceSearchResultsIOS from '../hooks/useAnnounceSearchResultsIOS'
import useReportError from '../hooks/useReportError'
import useResourceCache from '../hooks/useResourceCache'
import testID from '../testing/testID'
import sendTrackingSignal from '../utils/sendTrackingSignal'

const Wrapper = styled.View`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${props => props.theme.colors.backgroundColor};
  color: ${props => props.theme.colors.textColor};
`

const SearchCounter = styled.Text`
  margin: 10px 20px;
  color: ${props => props.theme.colors.textSecondaryColor};
`

export type SearchModalProps = {
  documents: ExtendedPageModel[]
  fallbackLanguageDocuments: ExtendedPageModel[]
  languageCode: string
  cityCode: string
  closeModal: (query: string) => void
  initialSearchText: string
}

const SearchModal = ({
  documents,
  fallbackLanguageDocuments,
  languageCode,
  cityCode,
  closeModal,
  initialSearchText,
}: SearchModalProps): ReactElement | null => {
  const [query, setQuery] = useState<string>(initialSearchText)
  const resourceCache = useResourceCache({ cityCode, languageCode })
  const { t } = useTranslation('search')

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

  const onClose = (): void => {
    sendTrackingSignal({
      signal: {
        name: SEARCH_FINISHED_SIGNAL_NAME,
        query,
        url: null,
      },
    })
    closeModal(query)
  }

  const renderItem = ({ item }: { item: ExtendedPageModel }) => (
    <SearchListItem
      key={item.path}
      title={item.title}
      resourceCache={resourceCache[item.path] ?? {}}
      contentWithoutHtml={parseHTML(item.content)}
      language={languageCode}
      query={debouncedQuery}
      thumbnail={item.thumbnail}
      path={item.path}
    />
  )

  return (
    <Wrapper {...testID('Search-Page')}>
      <SearchHeader query={query} closeSearchBar={onClose} onSearchChanged={setQuery} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        {debouncedQuery.length > 0 && (
          <>
            <SearchCounter accessibilityLiveRegion={searchResults.length === 0 ? 'assertive' : 'polite'}>
              {t('searchResultsCount', { count: searchResults.length })}
            </SearchCounter>
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

export default SearchModal
