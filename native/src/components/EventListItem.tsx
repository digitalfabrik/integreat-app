import { DateTime } from 'luxon'
import React, { JSXElementConstructor, memo, ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { SvgProps } from 'react-native-svg'
import styled from 'styled-components/native'

import { parseHTML, getDisplayDate } from 'shared'
import { DateModel, DateIcon, EventModel } from 'shared/api'

import {
  CalendarRecurringIcon,
  CalendarTodayIcon,
  CalendarTodayRecurringIcon,
  EventThumbnailPlaceholder1,
  EventThumbnailPlaceholder2,
  EventThumbnailPlaceholder3,
} from '../assets'
import { EXCERPT_MAX_LINES } from '../constants'
import { contentAlignment } from '../constants/contentDirection'
import ListItem from './ListItem'
import Icon from './base/Icon'

const Description = styled.Text<{ language: string; withMargin?: boolean }>`
  color: ${props => props.theme.legacy.colors.textColor};
  font-family: ${props => props.theme.legacy.fonts.native.contentFontRegular};
  text-align: ${props => contentAlignment(props.language)};
  margin-top: ${props => (props.withMargin ? '4px' : 0)};
`

const placeholderThumbnails = [EventThumbnailPlaceholder1, EventThumbnailPlaceholder2, EventThumbnailPlaceholder3]

const getDateIcon = (date: DateModel): { icon: JSXElementConstructor<SvgProps>; label: string } | null => {
  const icons: { [key in DateIcon]: JSXElementConstructor<SvgProps> } = {
    CalendarTodayRecurringIcon,
    CalendarRecurringIcon,
    CalendarTodayIcon,
  }
  const iconToUse = date.getDateIcon()
  return iconToUse
    ? {
        icon: icons[iconToUse.icon],
        label: iconToUse.label,
      }
    : null
}

type EventListItemProps = {
  event: EventModel
  language: string
  navigateToEvent: (slug: string) => void
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
  const icon = getDateIcon(event.date)

  // Use the content language to match the surrounding translations
  const { t: translateIntoContentLanguage } = useTranslation('events', { lng: language })
  const dateToDisplay = getDisplayDate(event, filterStartDate, filterEndDate)

  const DateIcon = icon ? <Icon Icon={icon.icon} label={translateIntoContentLanguage(icon.label)} /> : null

  return (
    <ListItem
      thumbnail={thumbnail}
      title={event.title}
      language={language}
      navigateTo={() => navigateToEvent(event.slug)}
      Icon={DateIcon}>
      <Description language={language}>
        {dateToDisplay.formatEventDateInOneLine(language, translateIntoContentLanguage)}
      </Description>
      {!!event.location && <Description language={language}>{event.location.name}</Description>}
      <Description numberOfLines={EXCERPT_MAX_LINES} language={language} withMargin>
        {content}
      </Description>
    </ListItem>
  )
}

export default memo(EventListItem)
