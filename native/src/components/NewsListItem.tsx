import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Divider } from 'react-native-paper'
import styled, { useTheme } from 'styled-components/native'

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
const StyledIcon = styled(Icon)`
  margin: 6px 4px 0;
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

const NewsListItem = ({ index, newsItem, navigateToNews, isTunews }: NewsListItemProps): ReactElement => {
  const { t, i18n } = useTranslation('news')
  const timestamp = newsItem instanceof LocalNewsModel ? newsItem.timestamp : null
  const { languageCode } = useAppContext()
  const theme = useTheme()

  return (
    <>
      <StyledDivider horizontalInset firstItem={index === 0} />
      <ListItemWrapper>
        <StyledPressable onPress={navigateToNews} accessibilityLanguage={languageCode} role='link'>
          <Description>
            <Text variant='h5' style={{ marginBottom: 8, marginTop: 8 }}>
              {newsItem.title}
            </Text>
            <Text variant='body2' numberOfLines={EXCERPT_MAX_LINES} style={{ letterSpacing: 0.5 }}>
              {newsItem.content}
            </Text>
            {timestamp && (
              <Text variant='body2' style={{ paddingVertical: 10 }}>
                <TimeStamp lastUpdate={timestamp} showText={false} />
              </Text>
            )}
          </Description>
        </StyledPressable>
        <Pressable role='link' onPress={navigateToNews}>
          <ReadMoreWrapper language={i18n.language}>
            <Text
              variant='h6'
              onPress={navigateToNews}
              style={{
                fontSize: 12,
                letterSpacing: 0.5,
                marginTop: 3,
                color: isTunews && !theme.dark ? theme.colors.tunews.main : theme.colors.secondary,
              }}>
              {t('common:more')}
            </Text>
            <StyledIcon
              source='chevron-right'
              directionDependent
              size={14}
              color={isTunews && !theme.dark ? theme.colors.tunews.main : theme.colors.secondary}
            />
          </ReadMoreWrapper>
        </Pressable>
      </ListItemWrapper>
    </>
  )
}

export default NewsListItem
