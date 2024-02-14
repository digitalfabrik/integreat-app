import { TFunction } from 'i18next'
import React, { ReactElement, useState } from 'react'
import { KeyboardAvoidingView, Platform } from 'react-native'
import styled from 'styled-components/native'

import { ThemeType } from 'build-configs'
import { parseHTML, SEARCH_FINISHED_SIGNAL_NAME, SEARCH_ROUTE, SearchResult, useMiniSearch } from 'shared'

import FeedbackContainer from '../components/FeedbackContainer'
import HorizontalLine from '../components/HorizontalLine'
import List from '../components/List'
import LoadingSpinner from '../components/LoadingSpinner'
import NothingFound from '../components/NothingFound'
import SearchHeader from '../components/SearchHeader'
import SearchListItem from '../components/SearchListItem'
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
`

export type SearchModalProps = {
  allPossibleResults: Array<SearchResult>
  theme: ThemeType
  languageCode: string
  cityCode: string
  closeModal: (query: string) => void
  t: TFunction<'search'>
  initialSearchText: string
  loading: boolean
}

const SearchModal = ({
  allPossibleResults,
  theme,
  languageCode,
  cityCode,
  closeModal,
  t,
  initialSearchText = '',
  loading,
}: SearchModalProps): ReactElement => {
  const [query, setQuery] = useState<string>(initialSearchText)
  const resourceCache = useResourceCache({ cityCode, languageCode })

  const minisearch = useMiniSearch(allPossibleResults)

  // Minisearch doesn't add the returned storeFields (e.g. title or path) to its typing
  const searchResults = minisearch.search(query) as unknown as SearchResult[]

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

  if (loading) {
    return (
      <Wrapper {...testID('Search-Page')}>
        <SearchHeader theme={theme} query={query} closeSearchBar={onClose} onSearchChanged={setQuery} t={t} />
        <LoadingSpinner />
      </Wrapper>
    )
  }

  const renderItem = ({ item }: { item: SearchResult }) => (
    <SearchListItem
      key={item.id}
      title={item.title}
      resourceCache={item.path ? resourceCache[item.path] : {}}
      contentWithoutHtml={parseHTML(item.content)}
      language={languageCode}
      city={cityCode}
      query={query}
      thumbnail={item.thumbnail}
      path={item.path}
    />
  )

  return (
    <Wrapper {...testID('Search-Page')}>
      <SearchHeader theme={theme} query={query} closeSearchBar={onClose} onSearchChanged={setQuery} t={t} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <List
          items={query.length > 0 ? searchResults : allPossibleResults}
          renderItem={renderItem}
          accessibilityLabel={t('searchResultsCount', { count: searchResults.length })}
          noItemsMessage={
            <>
              <NothingFound />
              <HorizontalLine />
              <FeedbackContainer routeType={SEARCH_ROUTE} language={languageCode} cityCode={cityCode} query={query} />
            </>
          }
        />
      </KeyboardAvoidingView>
    </Wrapper>
  )
}

export default SearchModal
