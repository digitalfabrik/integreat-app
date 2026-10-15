import React, { ReactElement } from 'react'
import { StyleSheet, View } from 'react-native'
import { List as PaperList } from 'react-native-paper'
import styled from 'styled-components/native'

import { parseHTML } from 'shared'
import { NewsModel } from 'shared/api'

import { EXCERPT_MAX_LINES } from '../constants'
import { contentAlignmentRTLText, contentDirection } from '../constants/contentDirection'
import { useAppContext } from '../hooks/useRegionAppContext'
import useVisitedIds from '../hooks/useVisitedIds'
import NewChip from './NewChip'
import NewsSourceChip from './NewsSourceChip'
import TimeStamp from './TimeStamp'
import Text from './base/Text'

type NewsListItemProps = {
  newsItem: NewsModel
  regionCode: string
  navigateToNews: () => void
}

const Styles = StyleSheet.create({
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chips: {
    alignSelf: 'flex-start',
    alignItems: 'center',
    gap: 8,
  },
})

export const Description = styled.View`
  flex-direction: column;
`

const NewsListItem = ({ newsItem, regionCode, navigateToNews }: NewsListItemProps): ReactElement => {
  const { languageCode } = useAppContext()
  const [visitedNewsIds] = useVisitedIds({ key: 'visitedNewsIds', regionCode })
  const isNew = newsItem.isNew && !visitedNewsIds.includes(newsItem.id)

  // PaperList.Item wraps non-function titles in <Text> which causes the chip to get cut off on iOS
  const title = () => (
    <View style={[Styles.titleRow, { flexDirection: contentDirection(languageCode) }]}>
      <Text variant='h5' style={{ textAlign: contentAlignmentRTLText(newsItem.title), flex: 1 }}>
        {newsItem.title}
      </Text>
      <View style={[Styles.chips, { flexDirection: contentDirection(languageCode) }]}>
        {isNew && <NewChip />}
        <NewsSourceChip source={newsItem.source} />
      </View>
    </View>
  )

  return (
    <PaperList.Item
      borderless
      titleNumberOfLines={0}
      descriptionNumberOfLines={0}
      title={title}
      description={
        <Description>
          <Text
            variant='body2'
            numberOfLines={EXCERPT_MAX_LINES}
            style={{ letterSpacing: 0.5, textAlign: contentAlignmentRTLText(newsItem.title) }}>
            {parseHTML(newsItem.content)}
          </Text>
          <Text variant='body2'>
            <TimeStamp lastUpdate={newsItem.lastUpdate} showText={false} />
          </Text>
        </Description>
      }
      onPress={navigateToNews}
      accessibilityLanguage={languageCode}
      role='link'
    />
  )
}

export default NewsListItem
