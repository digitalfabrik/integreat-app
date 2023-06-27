import moment from 'moment'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, Platform } from 'react-native'
import RNCalendarEvents, { Calendar } from 'react-native-calendar-events'
import { Button } from 'react-native-elements'
import { useTheme } from 'styled-components'

import { EventModel } from 'api-client'

import useSnackbar from '../hooks/useSnackbar'
import CalendarChoice from './CalendarChoice'

type ExportEventButtonType = {
  event: EventModel
}

const ExportEventButton = ({ event }: ExportEventButtonType): ReactElement => {
  const { t } = useTranslation('events')
  const theme = useTheme()
  const showSnackbar = useSnackbar()

  const [eventExported, setEventExported] = useState<boolean>(false)
  const [showCalendarChoiceOverlay, setShowCalendarChoiceOverlay] = useState<boolean>(false)
  const [calendars, setCalendars] = useState<Calendar[]>()

  const saveEventToCalendar = async (calendarId: string | undefined): Promise<void> => {
    await RNCalendarEvents.saveEvent(event.title, {
      startDate: event.date.startDate.toISOString(),
      endDate: event.date.endDate.toISOString(),
      allDay: event.date.allDay,
      location: event.location?.fullAddress,
      description: event.excerpt,
      calendarId,
    })
      .then(id => {
        setEventExported(true)
        showSnackbar({
          text: t('added'),
          positiveAction: {
            label: t('goToCalendar'),
            onPress: () => {
              if (Platform.OS === 'ios') {
                const appleRefDate = moment('Jan 1 2001', 'MMM DD YYYY')
                const secondsSinceRefDate = event.date.startDate.diff(appleRefDate, 'seconds')
                Linking.openURL(`calshow:${secondsSinceRefDate}`)
              } else if (Platform.OS === 'android') {
                Linking.openURL(`content://com.android.calendar/events/${id}`)
              }
            },
          },
        })
      })
      .catch(() => {
        showSnackbar({ text: 'generalError' })
      })
  }

  const checkCalendarsAndSaveEvent = async (): Promise<void> => {
    let permission = await RNCalendarEvents.checkPermissions()
    if (permission === 'undetermined') {
      permission = await RNCalendarEvents.requestPermissions()
    }
    if (permission === 'denied' || permission === 'restricted') {
      showSnackbar({
        text: 'noCalendarPermission',
        positiveAction: {
          label: t('settings'),
          onPress: Linking.openSettings,
        },
      })
      return
    }
    const editableCalendars = (await RNCalendarEvents.findCalendars()).filter(cal => cal.allowsModifications)
    if (editableCalendars.length === 0) {
      showSnackbar({ text: 'noCalendarFound' })
    } else if (editableCalendars.length === 1) {
      saveEventToCalendar(editableCalendars[0]?.id)
    } else {
      setCalendars(editableCalendars)
      setShowCalendarChoiceOverlay(true)
    }
  }

  return (
    <>
      {!!calendars?.length && (
        <CalendarChoice
          closeOverlay={() => setShowCalendarChoiceOverlay(false)}
          overlayVisible={showCalendarChoiceOverlay}
          chooseCalendar={async (id: string) => {
            setShowCalendarChoiceOverlay(false)
            await saveEventToCalendar(id).catch(() => {
              showSnackbar({ text: 'generalError' })
            })
          }}
          calendars={calendars}
        />
      )}
      <Button
        title={t('addToCalendar')}
        onPress={checkCalendarsAndSaveEvent}
        buttonStyle={{
          backgroundColor: theme.colors.themeColor,
          margin: 14,
        }}
        titleStyle={{
          color: theme.colors.textColor,
          fontFamily: theme.fonts.native.contentFontRegular,
        }}
        disabled={eventExported}
      />
    </>
  )
}

export default ExportEventButton
