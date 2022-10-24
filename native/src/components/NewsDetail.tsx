import * as React from 'react'
import { ReactElement, useContext } from 'react'
import { ScrollView, View } from 'react-native'
import styled from 'styled-components/native'

import { LocalNewsModel, replaceLinks, TunewsModel } from 'api-client'

import headerImage from '../assets/tu-news-header-details-icon.svg'
import { contentAlignment } from '../constants/contentDirection'
import DateFormatterContext from '../contexts/DateFormatterContext'
import NativeHtml from './NativeHtml'
import TimeStamp from './TimeStamp'

const Container = styled.View`
  align-items: center;
  margin-horizontal: 3%;
  flex: 1;
`
const TimeStampContent = styled.Text<{ language: string }>`
  padding: 17px 0px;
  text-align: ${props => contentAlignment(props.language)};
`
const HeaderImageWrapper = styled.View`
  width: 95%;
  align-self: center;
  align-items: flex-start;
  margin-top: 19px;
  border-radius: 5px;
  background-color: rgba(2, 121, 166, 0.4);
`
const HeaderImage = styled.Image`
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
`
const NewsHeadLine = styled.Text`
  font-weight: 700;
  font-family: ${props => props.theme.fonts.native.decorativeFontBold};
  color: ${props => props.theme.colors.textColor};
  font-size: 18px;
  margin-top: 18px;
  margin-bottom: 15px;
`
type NewsDetailProps = {
  language: string
  newsItem: TunewsModel | LocalNewsModel
}

const NewsDetail = ({ newsItem, language }: NewsDetailProps): ReactElement => {
  const formatter = useContext(DateFormatterContext)
  const content = newsItem instanceof TunewsModel ? newsItem.content : replaceLinks(newsItem.message)
  return (
    <View
      style={{
        flex: 1,
      }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          marginBottom: 10,
          paddingHorizontal: '5%',
        }}>
        {newsItem instanceof TunewsModel && (
          <HeaderImageWrapper>
            <HeaderImage source={headerImage} />
          </HeaderImageWrapper>
        )}
        <Container>
          <NewsHeadLine>{newsItem.title}</NewsHeadLine>
          <NativeHtml language={language} content={content} />
          {newsItem instanceof LocalNewsModel && (
            <TimeStampContent language={language}>
              <TimeStamp formatter={formatter} lastUpdate={newsItem.timestamp} showText={false} format='LLL' />
            </TimeStampContent>
          )}
        </Container>
      </ScrollView>
    </View>
  )
}

export default NewsDetail
