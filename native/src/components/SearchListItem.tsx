import React, { memo, ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import { TouchableRipple } from 'react-native-paper'
import styled from 'styled-components/native'

import { getExcerpt, InternalPathnameParser, SEARCH_FINISHED_SIGNAL_NAME } from 'shared'

import { SEARCH_PREVIEW_MAX_CHARS } from '../constants'
import buildConfig from '../constants/buildConfig'
import { contentDirection } from '../constants/contentDirection'
import useNavigate from '../hooks/useNavigate'
import urlFromRouteInformation from '../navigation/url'
import sendTrackingSignal from '../utils/sendTrackingSignal'
import { CategoryThumbnail } from './CategoryListItem'
import Highlighter from './Highlighter'

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
  border-bottom-color: ${props => props.theme.colors.secondary};
`

const TitleDirectionContainer = styled.View<{ language: string }>`
  flex-direction: ${props => contentDirection(props.language)};
  align-items: center;
`

const HighlighterCategoryTitle = styled(Highlighter)<{ language: string }>`
  flex-direction: ${props => contentDirection(props.language)};
  font-family: ${props => props.theme.legacy.fonts.native.decorativeFontRegular};
  color: ${props => props.theme.colors.onSurface};
  font-weight: bold;
  flex-shrink: 1;
`

const styles = StyleSheet.create({
  TouchableRippleStyle: {
    flexDirection: 'column',
    marginHorizontal: 20,
  },
})

type SearchListItemProps = {
  title: string
  contentWithoutHtml: string
  language: string
  query: string
  path: string
  thumbnail: string | null
}

const SearchListItem = ({
  language,
  title,
  contentWithoutHtml,
  query,
  path,
  thumbnail,
}: SearchListItemProps): ReactElement => {
  const { t } = useTranslation('search')
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

  return (
    <TouchableRipple
      borderless
      onPress={navigateToSearchResult}
      role='link'
      accessibilityHint={t('itemHint')}
      accessibilityLanguage={language}
      style={styles.TouchableRippleStyle}>
      <DirectionContainer language={language}>
        <SearchEntryContainer>
          <TitleDirectionContainer language={language}>
            {!!thumbnail && <CategoryThumbnail language={language} source={thumbnail} />}
            <HighlighterCategoryTitle language={language} text={title} search={query} />
          </TitleDirectionContainer>
          {excerpt.length > 0 && <Highlighter search={query} text={excerpt} />}
        </SearchEntryContainer>
      </DirectionContainer>
    </TouchableRipple>
  )
}

export default memo(SearchListItem)
