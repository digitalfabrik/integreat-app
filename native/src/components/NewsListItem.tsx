import * as React from 'react'
import { ReactElement, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import styled from 'styled-components/native'

import { LocalNewsModel, TunewsModel } from 'api-client'
import { config } from 'translations'

import { contentAlignment, contentDirection } from '../constants/contentDirection'
import DateFormatterContext from '../contexts/DateFormatterContext'
import TimeStamp from './TimeStamp'

type PropsType = {
  index: number
  newsItem: LocalNewsModel | TunewsModel
  language: string
  navigateToNews: () => void
  isTunews: boolean
}

const ListItemView = styled.View<{ language: string }>`
  flex-direction: ${props => contentDirection(props.language)};
`
const ReadMoreWrapper = styled.View<{ language: string }>`
  flex-direction: ${props => contentDirection(props.language)};
  justify-content: flex-end;
  width: 100%;
  align-self: center;
`
const Icon = styled(MaterialIcon)<{ isTunews: boolean }>`
  font-size: 20px;
  top: 4px;
  right: 5px;
  left: 0px;
  color: ${props => (props.isTunews ? props.theme.colors.tunewsThemeColor : props.theme.colors.themeColor)};
`
const ListItemWrapper = styled.View`
  padding-horizontal: 5%;
`
const StyledTouchableOpacity = styled.TouchableOpacity`
  flex-direction: column;
`

const Divider = styled.View<{ firstItem: boolean }>`
  border-top-width: 0.5px;
  border-top-color: ${props => props.theme.colors.textSecondaryColor};
  width: 80%;
  margin-top: ${props => (props.firstItem ? '0px' : '12px')};
  margin-bottom: 12px;
  align-self: center;
`
export const Description = styled.View`
  flex-direction: column;
  font-family: ${props => props.theme.fonts.native.decorativeFontRegular};
`
export const Title = styled.Text`
  font-weight: 700;
  font-family: ${props => props.theme.fonts.native.decorativeFontBold};
  color: ${props => props.theme.colors.textColor};
  font-size: 16px;
  margin-bottom: 8px;
  margin-top: 8px;
`
export const Content = styled.Text<{ language: string }>`
  font-family: ${props => props.theme.fonts.native.decorativeFontRegular};
  font-size: 14px;
  letter-spacing: 0.5px;
  text-align: ${props => contentAlignment(props.language)};
  color: ${props => props.theme.colors.textColor};
`
const TimeStampContent = styled.Text<{ language: string }>`
  font-family: ${props => props.theme.fonts.native.decorativeFontRegular};
  font-size: 14px;
  padding: 10px 0px;
  text-align: ${props => contentAlignment(props.language)};
  color: ${props => props.theme.colors.textColor};
`
export const ReadMore = styled.Text<{ isTunews: boolean }>`
  font-family: ${props => props.theme.fonts.native.decorativeFontBold};
  font-size: 12px;
  letter-spacing: 0.5px;
  margin-top: 5px;
  color: ${props => (props.isTunews ? props.theme.colors.tunewsThemeColor : props.theme.colors.themeColor)};
`

const NewsListItem = ({ index, newsItem, language, navigateToNews, isTunews }: PropsType): ReactElement => {
  const { t, i18n } = useTranslation('news')
  const formatter = useContext(DateFormatterContext)
  const localNewsContent = newsItem instanceof LocalNewsModel ? newsItem.message : ''
  const tuNewsContent = newsItem instanceof TunewsModel ? newsItem.content : ''
  const content = localNewsContent || tuNewsContent
  const timestamp = newsItem instanceof LocalNewsModel ? newsItem.timestamp : null

  return (
    <>
      <Divider firstItem={index === 0} />
      <ListItemWrapper>
        <StyledTouchableOpacity onPress={navigateToNews}>
          <Description>
            <ListItemView language={language}>
              <Title>{newsItem.title}</Title>
            </ListItemView>
            <ListItemView language={language}>
              <Content numberOfLines={5} language={language}>
                {content}
              </Content>
            </ListItemView>
            {timestamp && (
              <ListItemView language={language}>
                <TimeStampContent language={language}>
                  <TimeStamp formatter={formatter} lastUpdate={timestamp} showText={false} />
                </TimeStampContent>
              </ListItemView>
            )}
          </Description>
          <ReadMoreWrapper language={i18n.language}>
            <ReadMore isTunews={isTunews} onPress={navigateToNews}>{`${t('readMore')}`}</ReadMore>
            <Icon
              isTunews={isTunews}
              name='keyboard-arrow-right'
              style={{
                transform: [
                  {
                    scaleX: config.hasRTLScript(i18n.language) ? -1 : 1,
                  },
                ],
              }}
            />
          </ReadMoreWrapper>
        </StyledTouchableOpacity>
      </ListItemWrapper>
    </>
  )
}

export default NewsListItem
