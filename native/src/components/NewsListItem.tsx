import React, { ReactElement, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import styled from 'styled-components/native'

import { LocalNewsModel, TunewsModel } from 'api-client'
import { config } from 'translations'

import { EXCERPT_MAX_LINES } from '../constants'
import { contentDirection } from '../constants/contentDirection'
import DateFormatterContext from '../contexts/DateFormatterContext'
import TimeStamp from './TimeStamp'
import Pressable from './base/Pressable'
import Text from './base/Text'

type NewsListItemProps = {
  index: number
  newsItem: LocalNewsModel | TunewsModel
  navigateToNews: () => void
  isTunews: boolean
}

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
  left: 0;
  color: ${props => (props.isTunews ? props.theme.colors.tunewsThemeColor : props.theme.colors.themeColor)};
`
const ListItemWrapper = styled.View`
  padding: 0 5%;
`
const StyledPressable = styled(Pressable)`
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
export const Title = styled(Text)`
  font-weight: 700;
  font-family: ${props => props.theme.fonts.native.decorativeFontBold};
  color: ${props => props.theme.colors.textColor};
  font-size: 16px;
  margin-bottom: 8px;
  margin-top: 8px;
`
export const Content = styled(Text)`
  font-family: ${props => props.theme.fonts.native.decorativeFontRegular};
  font-size: 14px;
  letter-spacing: 0.5px;
  color: ${props => props.theme.colors.textColor};
`
const TimeStampContent = styled(Text)`
  font-family: ${props => props.theme.fonts.native.decorativeFontRegular};
  font-size: 14px;
  padding: 10px 0;
  color: ${props => props.theme.colors.textColor};
`
export const ReadMore = styled(Text)<{ isTunews: boolean }>`
  font-family: ${props => props.theme.fonts.native.decorativeFontBold};
  font-size: 12px;
  letter-spacing: 0.5px;
  margin-top: 5px;
  color: ${props => (props.isTunews ? props.theme.colors.tunewsThemeColor : props.theme.colors.themeColor)};
`

const NewsListItem = ({ index, newsItem, navigateToNews, isTunews }: NewsListItemProps): ReactElement => {
  const { t, i18n } = useTranslation('news')
  const formatter = useContext(DateFormatterContext)
  const timestamp = newsItem instanceof LocalNewsModel ? newsItem.timestamp : null

  return (
    <>
      <Divider firstItem={index === 0} />
      <ListItemWrapper>
        <StyledPressable onPress={navigateToNews}>
          <Description>
            <Title>{newsItem.title}</Title>
            <Content numberOfLines={EXCERPT_MAX_LINES}>{newsItem.content}</Content>
            {timestamp && (
              <TimeStampContent>
                <TimeStamp formatter={formatter} lastUpdate={timestamp} showText={false} />
              </TimeStampContent>
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
        </StyledPressable>
      </ListItemWrapper>
    </>
  )
}

export default NewsListItem
