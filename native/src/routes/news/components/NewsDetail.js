// @flow

import * as React from 'react'
import { ScrollView, View, useWindowDimensions } from 'react-native'
import { LocalNewsModel, TunewsModel } from 'api-client'
import type { ThemeType } from 'build-configs/ThemeType'
import { contentAlignment } from '../../../modules/i18n/contentDirection'
import headerImage from '../assets/tu-news-header-details-icon.svg'
import styled from 'styled-components/native'
import type { StyledComponent } from 'styled-components'
import Html from 'react-native-render-html'
import TuNewsFooter from './TuNewsFooter'
import { useCallback } from 'react'

const Container: StyledComponent<{||}, {||}, *> = styled.View`
  align-items: center;
  margin-horizontal: 3%;
  flex: 1;
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
  font-family: ${props => props.theme.fonts.decorativeFontBold};
  color: ${props => props.theme.colors.textColor};
  font-size: 18px;
  margin-top: 18px;
  margin-bottom: 15px;
`

type PropsType = {|
  theme: ThemeType,
  language: string,
  selectedNewsItem: TunewsModel | LocalNewsModel,
  navigateToLink: (url: string, language: string, shareUrl: string) => void
|}

const NewsDetail = ({ theme, selectedNewsItem, language, navigateToLink }: PropsType) => {
  const localNewsContent = selectedNewsItem instanceof LocalNewsModel ? selectedNewsItem.message : ''
  const tuNewsContent = selectedNewsItem instanceof TunewsModel ? selectedNewsItem.content : ''
  const content = localNewsContent || tuNewsContent

  // https://stackoverflow.com/a/3809435
  const regex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www\.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w\-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[.!/\\\w]*))?)/g
  const urlContent = content.replace(regex, (matched: string) => `<a href="${matched}">${matched}</a>`)

  const onLinkPress = useCallback((_, url: string) => {
    navigateToLink(url, language, url)
  }, [navigateToLink, language])

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          marginBottom: 10,
          paddingHorizontal: '5%'
        }}>
        {selectedNewsItem instanceof TunewsModel && (
          <HeaderImageWrapper>
            <HeaderImage source={headerImage} />
          </HeaderImageWrapper>
        )}
        <Container>
          <NewsHeadLine theme={theme}>{selectedNewsItem.title}</NewsHeadLine>
          <Html source={{ html: urlContent }}
                contentWidth={useWindowDimensions().width}
                onLinkPress={onLinkPress}
                baseFontStyle={{
                  fontFamily: theme.fonts.decorativeFontRegular,
                  fontSize: 16,
                  letterSpacing: 0.5,
                  lineHeight: 24,
                  textAlign: contentAlignment(language),
                  color: theme.colors.textColor
                }}
                defaultTextProps={{ selectable: true, allowFontStyling: true }} />
        </Container>
        {selectedNewsItem instanceof TunewsModel && <TuNewsFooter language={language}
                                                                  eNewsNo={selectedNewsItem.eNewsNo}
                                                                  date={selectedNewsItem.date}
                                                                  theme={theme} />}
      </ScrollView>
    </View>
  )
}

export default NewsDetail
