import { DateTime } from 'luxon'
import React, { memo, ReactElement, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import { List as PaperList } from 'react-native-paper'
import styled from 'styled-components/native'

import { parseHTML, RouteInformationType, EVENTS_ROUTE } from 'shared'
import { EventModel } from 'shared/api'

import { EventThumbnailPlaceholder1, EventThumbnailPlaceholder2, EventThumbnailPlaceholder3 } from '../assets'
import { EXCERPT_MAX_LINES } from '../constants'
import { contentAlignment, contentDirection } from '../constants/contentDirection'
import EventDates from './EventDates'
import SimpleImage from './SimpleImage'
import Icon from './base/Icon'
import Text from './base/Text'

const styles = StyleSheet.create({
  thumbnail: {
    width: 72,
    height: 72,
    marginHorizontal: 8,
  },
})

const LocationRow = styled.View<{ language: string }>`
  flex-direction: ${props => contentDirection(props.language)};
  align-items: center;
  gap: 4px;
`

const placeholderThumbnails = [EventThumbnailPlaceholder1, EventThumbnailPlaceholder2, EventThumbnailPlaceholder3]

type EventListItemProps = {
  event: EventModel
  language: string
  navigateTo: (route: RouteInformationType) => void
  regionCode: string
  filterStartDate?: DateTime | null
  filterEndDate?: DateTime | null
}

const EventListItem = ({
  language,
  event,
  regionCode,
  navigateTo,
  filterStartDate = null,
  filterEndDate = null,
}: EventListItemProps): ReactElement => {
  const thumbnail =
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    event.thumbnail || placeholderThumbnails[event.path.length % placeholderThumbnails.length]!
  const content = parseHTML(event.content).trim()

  // Use the content language to match the surrounding translations
  const { t: translateIntoContentLanguage } = useTranslation('events', { lng: language })
  const isRtl = contentAlignment(language) === 'right'

  const DateIcon = useCallback(
    () =>
      event.isRecurring ? (
        <Icon source='calendar-refresh-outline' label={translateIntoContentLanguage('recurring')} />
      ) : null,
    [event.isRecurring, translateIntoContentLanguage],
  )

  const renderThumbnail = useCallback(() => <SimpleImage style={styles.thumbnail} source={thumbnail} />, [thumbnail])

  const handlePress = useCallback(() => {
    navigateTo({
      route: EVENTS_ROUTE,
      regionCode,
      languageCode: language,
      slug: event.slug,
    })
  }, [navigateTo, regionCode, language, event.slug])

  return (
    <PaperList.Item
      borderless
      titleNumberOfLines={0}
      descriptionNumberOfLines={0}
      descriptionStyle={{ marginTop: 8 }}
      title={
        <Text variant='h5' style={{ textAlign: contentAlignment(language) }}>
          {event.title}
        </Text>
      }
      description={
        <View style={{ gap: 8, width: '100%' }}>
          <EventDates
            event={event}
            language={language}
            filterStartDate={filterStartDate}
            filterEndDate={filterEndDate}
            size='small'
          />
          {!!event.location && (
            <LocationRow language={language}>
              <Icon source='map-marker-outline' size={16} />
              <Text variant='body3' style={{ textAlign: contentAlignment(language), flexShrink: 1 }}>
                {event.location.name}
              </Text>
            </LocationRow>
          )}
          <Text
            variant='body3'
            numberOfLines={EXCERPT_MAX_LINES}
            style={{ textAlign: contentAlignment(language), marginTop: 4 }}>
            {content}
          </Text>
        </View>
      }
      left={isRtl ? DateIcon : renderThumbnail}
      right={isRtl ? renderThumbnail : DateIcon}
      onPress={handlePress}
    />
  )
}

export default memo(EventListItem)
