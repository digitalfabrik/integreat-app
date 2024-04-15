import React, { memo, ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import Highlighter from 'react-native-highlight-words'
import styled, { useTheme } from 'styled-components/native'

import { getExcerpt, InternalPathnameParser, normalizeString, SEARCH_FINISHED_SIGNAL_NAME } from 'shared'

import { SEARCH_PREVIEW_MAX_CHARS } from '../constants'
import buildConfig from '../constants/buildConfig'
import { contentDirection } from '../constants/contentDirection'
import useNavigate from '../hooks/useNavigate'
import urlFromRouteInformation from '../navigation/url'
import { PageResourceCacheStateType } from '../utils/DataContainer'
import sendTrackingSignal from '../utils/sendTrackingSignal'
import { CategoryThumbnail } from './CategoryListItem'
import Pressable from './base/Pressable'

const FlexStyledLink = styled(Pressable)`
  display: flex;
  flex-direction: column;
  margin: 0 20px;
`

const DirectionContainer = styled.View<{ language: string }>`
  display: flex;
  flex-direction: ${props => contentDirection(props.language)};
`

const SearchEntryContainer = styled.View`
  flex: 1;
  flex-direction: column;
  align-self: center;
  padding: 15px 0;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.colors.themeColor};
`

const TitleDirectionContainer = styled.View<{ language: string }>`
  flex-direction: ${props => contentDirection(props.language)};
  align-items: center;
`

const HighlighterCategoryTitle = styled(Highlighter)<{ language: string }>`
  flex-direction: ${props => contentDirection(props.language)};
  font-family: ${props => props.theme.fonts.native.decorativeFontRegular};
  color: ${props => props.theme.colors.textColor};
`

type SearchListItemProps = {
  title: string
  contentWithoutHtml: string
  resourceCache: PageResourceCacheStateType
  language: string
  query: string
  path: string
  thumbnail: string | null
}

const SearchListItem = ({
  language,
  title,
  resourceCache,
  contentWithoutHtml,
  query,
  path,
  thumbnail,
}: SearchListItemProps): ReactElement => {
  const { t } = useTranslation('search')
  const theme = useTheme()
  const { navigateTo } = useNavigate()
  const excerpt = getExcerpt(contentWithoutHtml, { query, maxChars: SEARCH_PREVIEW_MAX_CHARS })

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

  const Content =
    query && excerpt.length > 0 ? (
      <Highlighter
        searchWords={[query]}
        sanitize={normalizeString}
        textToHighlight={excerpt}
        autoEscape
        highlightStyle={{ backgroundColor: theme.colors.backgroundColor, fontWeight: 'bold' }}
      />
    ) : null

  const Title = (
    <HighlighterCategoryTitle
      language={language}
      autoEscape
      textToHighlight={title}
      sanitize={normalizeString}
      searchWords={query ? [query] : []}
      highlightStyle={{
        fontWeight: 'bold',
      }}
    />
  )

  return (
    <FlexStyledLink onPress={navigateToSearchResult} accessibilityHint={t('itemHint')}>
      <DirectionContainer language={language}>
        <SearchEntryContainer>
          <TitleDirectionContainer language={language}>
            <CategoryThumbnail language={language} source={thumbnail} resourceCache={resourceCache} />
            {Title}
          </TitleDirectionContainer>
          {Content}
        </SearchEntryContainer>
      </DirectionContainer>
    </FlexStyledLink>
  )
}

export default memo(SearchListItem)
