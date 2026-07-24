import React, { ReactElement } from 'react'
import { StyleSheet, View } from 'react-native'
import { List as PaperList } from 'react-native-paper'
import styled from 'styled-components/native'

import { parseHTML } from 'shared'
import { NewsModel } from 'shared/api'

import { EXCERPT_MAX_LINES } from '../constants'
import { contentAlignmentRTLText } from '../constants/contentDirection'
import { useAppContext } from '../hooks/useRegionAppContext'
import NewsSourceChip from './NewsSourceChip'
import TimeStamp from './TimeStamp'
import Text from './base/Text'

type NewsListItemProps = {
  newsItem: NewsModel
  navigateToNews: () => void
}

const Styles = StyleSheet.create({
  bottomInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
})

export const Description = styled.View`
  flex-direction: column;
`

const NewsListItem = ({ newsItem, navigateToNews }: NewsListItemProps): ReactElement => {
  const { languageCode } = useAppContext()

  return (
    <PaperList.Item
      borderless
      titleNumberOfLines={0}
      descriptionNumberOfLines={0}
      title={
        <View style={Styles.titleRow}>
          <Text variant='h5' style={{ textAlign: contentAlignmentRTLText(newsItem.title), flex: 1 }}>
            {newsItem.title}
          </Text>
          <NewsSourceChip source={newsItem.source} />
        </View>
      }
      description={
        <Description>
          <Text
            variant='body2'
            numberOfLines={EXCERPT_MAX_LINES}
            style={{ letterSpacing: 0.5, textAlign: contentAlignmentRTLText(newsItem.title) }}>
            {parseHTML(newsItem.content)}
          </Text>
          <View style={Styles.bottomInfo}>
            <Text variant='body2'>
              <TimeStamp lastUpdate={newsItem.lastUpdate} showText={false} />
            </Text>
          </View>
        </Description>
      }
      onPress={navigateToNews}
      accessibilityLanguage={languageCode}
      role='link'
    />
  )
}

export default NewsListItem
