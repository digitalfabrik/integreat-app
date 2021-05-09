// @flow

import * as React from 'react'
import { useCallback, useContext } from 'react'
import { ScrollView, useWindowDimensions, View } from 'react-native'
import { LocalNewsModel, replaceLinks, TunewsModel } from 'api-client'
import type { ThemeType } from 'build-configs/ThemeType'
import { contentAlignment } from '../../../modules/i18n/contentDirection'
import headerImage from '../assets/tu-news-header-details-icon.svg'
import styled from 'styled-components/native'
import type { StyledComponent } from 'styled-components'
import Html from 'react-native-render-html'
import TimeStamp from '../../../modules/common/components/TimeStamp'
import DateFormatterContext from '../../../modules/i18n/context/DateFormatterContext'

const Container: StyledComponent<{||}, {||}, *> = styled.View`
  align-items: center;
  margin-horizontal: 3%;
  flex: 1;
`

const TimeStampContent: StyledComponent<{| language: string |}, ThemeType, *> = styled.Text`
  padding: 17px 0px
  text-align: ${props => contentAlignment(props.language)};
`

const HeaderImageWrapper: StyledComponent<{||}, ThemeType, *> = styled.View`
  width: 95%;
  align-self: center;
  align-items: flex-start;
  margin-top: 19px;
  border-radius: 5px;
  background-color: rgba(2, 121, 166, 0.4);
`

const HeaderImage: StyledComponent<{||}, ThemeType, *> = styled.Image`
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
`

const NewsHeadLine: StyledComponent<{||}, ThemeType, *> = styled.Text`
  font-weight: 700;
  font-family: ${props => props.theme.fonts.native.decorativeFontBold};
  color: ${props => props.theme.colors.textColor};
  font-size: 18px;
  margin-top: 18px;
  margin-bottom: 15px;
`

type PropsType = {|
  theme: ThemeType,
  language: string,
  newsItem: TunewsModel | LocalNewsModel,
  navigateToLink: (url: string, language: string, shareUrl: string) => void
|}

const NewsDetail = ({ theme, newsItem, language, navigateToLink }: PropsType) => {
  const formatter = useContext(DateFormatterContext)
  const width = useWindowDimensions().width
  const content = newsItem instanceof TunewsModel ? newsItem.content : replaceLinks(newsItem.message)

  const onLinkPress = useCallback(
    (_, url: string) => {
      navigateToLink(url, language, url)
    },
    [navigateToLink, language]
  )

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          marginBottom: 10,
          paddingHorizontal: '5%'
        }}>
        {newsItem instanceof TunewsModel && (
          <HeaderImageWrapper>
            <HeaderImage source={headerImage} />
          </HeaderImageWrapper>
        )}
        <Container>
          <NewsHeadLine theme={theme}>{newsItem.title}</NewsHeadLine>
          <Html
            source={{ html: content }}
            contentWidth={width}
            onLinkPress={onLinkPress}
            baseFontStyle={{
              fontFamily: theme.fonts.native.decorativeFontRegular,
              fontSize: 16,
              letterSpacing: 0.5,
              lineHeight: 24,
              textAlign: contentAlignment(language),
              color: theme.colors.textColor
            }}
            defaultTextProps={{ selectable: true, allowFontStyling: true }}
          />
          {newsItem instanceof LocalNewsModel && (
            <TimeStampContent language={language} theme={theme}>
              <TimeStamp
                formatter={formatter}
                lastUpdate={newsItem.timestamp}
                showText={false}
                format={'LLL'}
                language={language}
                theme={theme}
              />
            </TimeStampContent>
          )}
        </Container>
      </ScrollView>
    </View>
  )
}

export default NewsDetail
