import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Divider } from 'react-native-paper'
import styled from 'styled-components/native'

import { LocalNewsModel, TunewsModel } from 'shared/api'

import { EXCERPT_MAX_LINES } from '../constants'
import { contentDirection } from '../constants/contentDirection'
import { useAppContext } from '../hooks/useCityAppContext'
import TimeStamp from './TimeStamp'
import Icon from './base/Icon'
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
const StyledIcon = styled(Icon)<{ isTunews: boolean }>`
  margin: 6px 4px 0;
  color: ${props =>
    props.isTunews && !props.theme.legacy.isContrastTheme
      ? props.theme.legacy.colors.tunewsThemeColor
      : props.theme.legacy.colors.themeColor};
  width: 14px;
  height: 14px;
`
const ListItemWrapper = styled.View`
  padding: 0 5%;
`
const StyledPressable = styled(Pressable)`
  flex-direction: column;
`

const StyledDivider = styled(Divider)<{ firstItem: boolean }>`
  margin-top: ${props => (props.firstItem ? '0px' : '12px')};
  margin-bottom: 12px;
`
export const Description = styled.View`
  flex-direction: column;
  font-family: ${props => props.theme.legacy.fonts.native.decorativeFontRegular};
`
export const Title = styled(Text)`
  font-weight: 700;
  font-family: ${props => props.theme.legacy.fonts.native.decorativeFontBold};
  color: ${props => props.theme.legacy.colors.textColor};
  font-size: 16px;
  margin-bottom: 8px;
  margin-top: 8px;
`
export const Content = styled(Text)`
  font-family: ${props => props.theme.legacy.fonts.native.decorativeFontRegular};
  font-size: 14px;
  letter-spacing: 0.5px;
  color: ${props => props.theme.legacy.colors.textColor};
`
const TimeStampContent = styled(Text)`
  font-family: ${props => props.theme.legacy.fonts.native.decorativeFontRegular};
  font-size: 14px;
  padding: 10px 0;
  color: ${props => props.theme.legacy.colors.textColor};
`
export const ReadMore = styled(Text)<{ isTunews: boolean }>`
  font-family: ${props => props.theme.legacy.fonts.native.decorativeFontBold};
  font-size: 12px;
  letter-spacing: 0.5px;
  margin-top: 5px;
  color: ${props =>
    props.isTunews && !props.theme.legacy.isContrastTheme
      ? props.theme.legacy.colors.tunewsThemeColor
      : props.theme.legacy.colors.themeColor};
`

const NewsListItem = ({ index, newsItem, navigateToNews, isTunews }: NewsListItemProps): ReactElement => {
  const { t, i18n } = useTranslation('news')
  const timestamp = newsItem instanceof LocalNewsModel ? newsItem.timestamp : null
  const { languageCode } = useAppContext()

  return (
    <>
      <StyledDivider horizontalInset firstItem={index === 0} />
      <ListItemWrapper>
        <StyledPressable onPress={navigateToNews} accessibilityLanguage={languageCode} role='link'>
          <Description>
            <Title>{newsItem.title}</Title>
            <Content numberOfLines={EXCERPT_MAX_LINES}>{newsItem.content}</Content>
            {timestamp && (
              <TimeStampContent>
                <TimeStamp lastUpdate={timestamp} showText={false} />
              </TimeStampContent>
            )}
          </Description>
        </StyledPressable>
        <Pressable role='link' onPress={navigateToNews}>
          <ReadMoreWrapper language={i18n.language}>
            <ReadMore isTunews={isTunews} onPress={navigateToNews}>
              {t('common:more')}
            </ReadMore>
            <StyledIcon source='chevron-left' directionDependent reverse isTunews={isTunews} />
          </ReadMoreWrapper>
        </Pressable>
      </ListItemWrapper>
    </>
  )
}

export default NewsListItem
