import React, { memo, ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import { List as PaperList } from 'react-native-paper'
import styled from 'styled-components/native'

import { getExcerpt, InternalPathnameParser, SEARCH_FINISHED_SIGNAL_NAME } from 'shared'

import { SEARCH_PREVIEW_MAX_CHARS } from '../constants'
import buildConfig from '../constants/buildConfig'
import { contentAlignment } from '../constants/contentDirection'
import useNavigate from '../hooks/useNavigate'
import urlFromRouteInformation from '../navigation/url'
import sendTrackingSignal from '../utils/sendTrackingSignal'
import Highlighter from './Highlighter'

const HighlighterCategoryTitle = styled(Highlighter)<{ language: string }>`
  text-align: ${props => contentAlignment(props.language)};
  font-family: ${props => props.theme.legacy.fonts.native.decorativeFontRegular};
  color: ${props => props.theme.colors.onSurface};
  font-weight: bold;
  flex-shrink: 1;
`

type SearchListItemProps = {
  title: string
  contentWithoutHtml: string
  language: string
  query: string
  path: string
}

const SearchListItem = ({ language, title, contentWithoutHtml, query, path }: SearchListItemProps): ReactElement => {
  const { t } = useTranslation('search')
  const { navigateTo } = useNavigate()
  const excerpt = getExcerpt(contentWithoutHtml, { query, maxChars: SEARCH_PREVIEW_MAX_CHARS })

  const styles = StyleSheet.create({
    ListItemStyle: {
      marginHorizontal: 16,
    },
  })

  const routeInformation = new InternalPathnameParser(path, language, buildConfig().featureFlags.fixedCity).route()
  if (!routeInformation) {
    return <View />
  }

  const navigateToSearchResult = (): void => {
    sendTrackingSignal({
      signal: {
        name: SEARCH_FINISHED_SIGNAL_NAME,
        query,
        url: urlFromRouteInformation(routeInformation),
      },
    })
    navigateTo(routeInformation)
  }

  return (
    <PaperList.Item
      titleNumberOfLines={0}
      descriptionNumberOfLines={0}
      borderless
      title={<HighlighterCategoryTitle language={language} text={title} search={query} />}
      description={excerpt.length > 0 ? <Highlighter search={query} text={excerpt} /> : undefined}
      onPress={navigateToSearchResult}
      role='link'
      accessibilityHint={t('itemHint')}
      accessibilityLanguage={language}
      style={styles.ListItemStyle}
    />
  )
}

export default memo(SearchListItem)
