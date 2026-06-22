import { DateTime } from 'luxon'
import React, { memo, ReactElement, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import { List as PaperList } from 'react-native-paper'

import { parseHTML, getDisplayDate } from 'shared'
import { EventModel } from 'shared/api'

import { EventThumbnailPlaceholder1, EventThumbnailPlaceholder2, EventThumbnailPlaceholder3 } from '../assets'
import { EXCERPT_MAX_LINES } from '../constants'
import { contentAlignment } from '../constants/contentDirection'
import SimpleImage from './SimpleImage'
import Text from './base/Text'

const styles = StyleSheet.create({
  thumbnail: {
    width: 72,
    height: 72,
    marginHorizontal: 8,
  },
})

const placeholderThumbnails = [EventThumbnailPlaceholder1, EventThumbnailPlaceholder2, EventThumbnailPlaceholder3]

type EventListItemProps = {
  event: EventModel
  language: string
  navigateToEvent: () => void
  filterStartDate?: DateTime | null
  filterEndDate?: DateTime | null
}

const EventListItem = ({
  language,
  event,
  navigateToEvent,
  filterStartDate = null,
  filterEndDate = null,
}: EventListItemProps): ReactElement => {
  const thumbnail =
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    event.thumbnail || placeholderThumbnails[event.path.length % placeholderThumbnails.length]!
  const content = parseHTML(event.content).trim()

  // Use the content language to match the surrounding translations
  const { t: translateIntoContentLanguage } = useTranslation('events', { lng: language })
  const dateToDisplay = getDisplayDate(event, filterStartDate, filterEndDate)
  const isRtl = contentAlignment(language) === 'right'

  const renderThumbnail = useCallback(() => <SimpleImage style={styles.thumbnail} source={thumbnail} />, [thumbnail])

  return (
    <PaperList.Item
      borderless
      titleNumberOfLines={0}
      descriptionNumberOfLines={0}
      style={{ paddingHorizontal: 8 }}
      title={<Text variant='h5'>{event.title}</Text>}
      description={
        <View>
          <Text variant='body3' style={{ textAlign: contentAlignment(language) }}>
            {dateToDisplay.formatEventDateInOneLine(language, translateIntoContentLanguage)}
          </Text>
          {!!event.location && (
            <Text variant='body3' style={{ textAlign: contentAlignment(language) }}>
              {event.location.name}
            </Text>
          )}
          <Text
            variant='body3'
            numberOfLines={EXCERPT_MAX_LINES}
            style={{ textAlign: contentAlignment(language), marginTop: 4 }}>
            {content}
          </Text>
        </View>
      }
      left={isRtl ? undefined : renderThumbnail}
      right={isRtl ? renderThumbnail : undefined}
      onPress={navigateToEvent}
    />
  )
}

export default memo(EventListItem)
