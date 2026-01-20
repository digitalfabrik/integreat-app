import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import { List as PaperList } from 'react-native-paper'
import styled, { useTheme } from 'styled-components/native'

import { LocalNewsModel, TunewsModel } from 'shared/api'

import { EXCERPT_MAX_LINES } from '../constants'
import { contentDirection } from '../constants/contentDirection'
import { useAppContext } from '../hooks/useCityAppContext'
import TimeStamp from './TimeStamp'
import Text from './base/Text'

type NewsListItemProps = {
  newsItem: LocalNewsModel | TunewsModel
  navigateToNews: () => void
}

const ReadMoreWrapper = styled.View<{ language: string }>`
  flex-direction: ${props => contentDirection(props.language)};
  justify-content: flex-end;
  align-self: center;
`

const ListItemWrapper = styled.View`
  padding: 0 5%;
`

const Styles = StyleSheet.create({
  bottomInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
})

export const Description = styled.View`
  flex-direction: column;
  font-family: ${props => props.theme.legacy.fonts.native.decorativeFontRegular};
`

const NewsListItem = ({ newsItem, navigateToNews }: NewsListItemProps): ReactElement => {
  const { t, i18n } = useTranslation('news')

  let timestamp = null
  if (newsItem instanceof LocalNewsModel) {
    timestamp = newsItem.timestamp
  }
  if (newsItem instanceof TunewsModel) {
    timestamp = newsItem.date
  }
  const { languageCode } = useAppContext()
  const theme = useTheme()

  return (
    <ListItemWrapper>
      <PaperList.Item
        borderless
        titleNumberOfLines={0}
        descriptionNumberOfLines={0}
        title={
          <Text variant='h5' style={{ marginBottom: 8, marginTop: 8 }}>
            {newsItem.title}
          </Text>
        }
        description={
          <Description>
            <Text variant='body2' numberOfLines={EXCERPT_MAX_LINES} style={{ letterSpacing: 0.5 }}>
              {newsItem.content}
            </Text>
            <View style={Styles.bottomInfo}>
              {timestamp ? (
                <Text variant='body2' style={{ paddingVertical: 8 }}>
                  <TimeStamp lastUpdate={timestamp} showText={false} />
                </Text>
              ) : (
                <View />
              )}
              <ReadMoreWrapper language={i18n.language}>
                <Text
                  variant='h6'
                  onPress={navigateToNews}
                  style={{
                    marginTop: 4,
                    color: theme.colors.primary,
                  }}>
                  {t('common:more')}
                </Text>
              </ReadMoreWrapper>
            </View>
          </Description>
        }
        onPress={navigateToNews}
        accessibilityLanguage={languageCode}
        role='link'
        style={{ flexDirection: 'column' }}
      />
    </ListItemWrapper>
  )
}

export default NewsListItem
