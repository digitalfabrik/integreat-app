import { DateTime } from 'luxon'
import React, { JSXElementConstructor, memo, ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { SvgProps } from 'react-native-svg'
import styled from 'styled-components/native'

import { parseHTML } from 'shared'
import { DateModel, DateIcon, EventModel } from 'shared/api'
import { getDisplayDate } from 'shared/utils/dateFilterUtils'

import {
  CalendarRecurringIcon,
  CalendarTodayIcon,
  CalendarTodayRecurringIcon,
  EventThumbnailPlaceholder1,
  EventThumbnailPlaceholder2,
  EventThumbnailPlaceholder3,
} from '../assets'
import { EXCERPT_MAX_LINES } from '../constants'
import ListItem from './ListItem'
import Icon from './base/Icon'

const Description = styled.Text`
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.native.contentFontRegular};
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
  navigateToEvent: () => void
  filterStartDate: DateTime | null
  filterEndDate: DateTime | null
}

const EventListItem = ({
  language,
  event,
  navigateToEvent,
  filterStartDate,
  filterEndDate,
}: EventListItemProps): ReactElement => {
  const thumbnail =
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    event.thumbnail || placeholderThumbnails[event.path.length % placeholderThumbnails.length]!
  const content = parseHTML(event.content).trim()
  const icon = getDateIcon(event.date)
  const { t } = useTranslation('events')
  const dateToDisplay = getDisplayDate(event, filterStartDate, filterEndDate)

  const DateIcon = icon ? <Icon Icon={icon.icon} label={t(icon.label)} /> : null

  return (
    <ListItem
      thumbnail={thumbnail}
      title={event.title}
      language={language}
      navigateTo={navigateToEvent}
      Icon={DateIcon}>
      <Description>{dateToDisplay.toFormattedString(language, true)}</Description>
      <Description numberOfLines={EXCERPT_MAX_LINES}>{content}</Description>
    </ListItem>
  )
}

export default memo(EventListItem)
