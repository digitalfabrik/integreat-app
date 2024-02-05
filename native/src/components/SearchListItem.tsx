import React, { memo, ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import Highlighter from 'react-native-highlight-words'
import styled, { useTheme } from 'styled-components/native'

import { getExcerpt, normalizeString } from 'shared'

import { SEARCH_PREVIEW_MAX_CHARS } from '../constants'
import { contentDirection } from '../constants/contentDirection'
import { PageResourceCacheStateType } from '../utils/DataContainer'
import { getCachedThumbnail } from './Categories'
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
  font-weight: bold;
`

type SearchListItemProps = {
  title: string
  contentWithoutHtml?: string
  resourceCache?: PageResourceCacheStateType
  followLink: (link: string) => void
  language: string
  query: string
  url?: string
  path?: string
  thumbnail?: string
}

const SearchListItem = ({
  language,
  title,
  resourceCache,
  contentWithoutHtml,
  followLink,
  query,
  path,
  url,
  thumbnail,
}: SearchListItemProps): ReactElement => {
  const { t } = useTranslation('search')
  const theme = useTheme()
  const excerpt = contentWithoutHtml
    ? getExcerpt(contentWithoutHtml, { query, maxChars: SEARCH_PREVIEW_MAX_CHARS })
    : ''

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
    <FlexStyledLink onPress={() => followLink(path ?? url ?? '')} accessibilityHint={t('itemHint')}>
      <DirectionContainer language={language}>
        <SearchEntryContainer>
          <TitleDirectionContainer language={language}>
            {!!thumbnail && resourceCache && (
              <CategoryThumbnail language={language} source={getCachedThumbnail(thumbnail, resourceCache)} />
            )}
            {Title}
          </TitleDirectionContainer>
          {Content}
        </SearchEntryContainer>
      </DirectionContainer>
    </FlexStyledLink>
  )
}

export default memo(SearchListItem)
