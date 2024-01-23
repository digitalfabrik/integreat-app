import { TFunction } from 'i18next'
import MiniSearch from 'minisearch'
import React, { ReactElement, useMemo, useState } from 'react'
import { KeyboardAvoidingView, Platform } from 'react-native'
import styled from 'styled-components/native'

import {
  InternalPathnameParser,
  parseHTML,
  RouteInformationType,
  SEARCH_FINISHED_SIGNAL_NAME,
  SEARCH_ROUTE,
  SearchResult,
} from 'api-client'
import { ThemeType } from 'build-configs'

import FeedbackContainer from '../components/FeedbackContainer'
import HorizontalLine from '../components/HorizontalLine'
import List from '../components/List'
import LoadingSpinner from '../components/LoadingSpinner'
import NothingFound from '../components/NothingFound'
import SearchHeader from '../components/SearchHeader'
import SearchListItem from '../components/SearchListItem'
import useResourceCache from '../hooks/useResourceCache'
import useSnackbar from '../hooks/useSnackbar'
import { urlFromRouteInformation } from '../navigation/url'
import testID from '../testing/testID'
import openExternalUrl from '../utils/openExternalUrl'
import sendTrackingSignal from '../utils/sendTrackingSignal'
import { reportError } from '../utils/sentry'

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
  navigateTo: (routeInformation: RouteInformationType) => void
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
  navigateTo,
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

  const minisearch = useMemo(() => {
    const search = new MiniSearch({
      fields: ['title', 'content'],
      storeFields: ['title', 'content', 'path', 'location', 'url', 'thumbnail'],
      searchOptions: {
        boost: { title: 2 },
        fuzzy: true,
        prefix: true,
      },
    })
    search.addAll(allPossibleResults)
    return search
  }, [allPossibleResults])

  // Minisearch doesn't add the returned storeFields (e.g. title or path) to its typing
  const searchResults = minisearch.search(query) as unknown as SearchResult[]

  const showSnackbar = useSnackbar()

  const followLink = (link: string, isExternalUrl: boolean): void => {
    if (isExternalUrl) {
      sendTrackingSignal({
        signal: {
          name: SEARCH_FINISHED_SIGNAL_NAME,
          query,
          url: link,
        },
      })
      openExternalUrl(link, showSnackbar)
    } else {
      const routeInformation = new InternalPathnameParser(link, languageCode, cityCode).route()
      if (!routeInformation) {
        reportError('no routeInformation found')
        showSnackbar({ text: 'unknownError' })
        return
      }
      sendTrackingSignal({
        signal: {
          name: SEARCH_FINISHED_SIGNAL_NAME,
          query,
          url: urlFromRouteInformation(routeInformation),
        },
      })
      navigateTo(routeInformation)
    }
  }

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
      contentWithoutHtml={item.location ?? parseHTML(item.content ?? '')}
      language={languageCode}
      query={query}
      followLink={link => followLink(link, !!item.url)}
      thumbnail={item.thumbnail}
      path={item.path}
      url={item.url}
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
