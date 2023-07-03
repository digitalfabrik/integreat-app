import moment from 'moment'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, Platform } from 'react-native'
import RNCalendarEvents, { Calendar } from 'react-native-calendar-events'
import { Button } from 'react-native-elements'
import { useTheme } from 'styled-components'

import { EventModel } from 'api-client'

import useSnackbar from '../hooks/useSnackbar'
import CalendarChoice from './CalendarChoiceModal'

type ExportEventButtonType = {
  event: EventModel
}

const ExportEventButton = ({ event }: ExportEventButtonType): ReactElement => {
  const { t } = useTranslation('events')
  const theme = useTheme()
  const showSnackbar = useSnackbar()

  const [eventExported, setEventExported] = useState<boolean>(false)
  const [showCalendarChoiceModal, setShowCalendarChoiceModal] = useState<boolean>(false)
  const [calendars, setCalendars] = useState<Calendar[]>()

  const openCalendarApp = (event: EventModel, id: string): void => {
    if (Platform.OS === 'ios') {
      // can't open a specific event but at a specific time
      const appleRefDate = moment('Jan 1 2001', 'MMM DD YYYY')
      const secondsSinceRefDate = event.date.startDate.diff(appleRefDate, 'seconds')
      Linking.openURL(`calshow:${secondsSinceRefDate}`)
    } else if (Platform.OS === 'android') {
      Linking.openURL(`content://com.android.calendar/events/${id}`)
    }
  }

  const exportEventToCalendar = async (calendarId: string | undefined): Promise<void> => {
    try {
      const id = await RNCalendarEvents.saveEvent(event.title, {
        startDate: event.date.startDate.toISOString(),
        endDate: event.date.endDate.toISOString(),
        allDay: event.date.allDay,
        location: event.location?.fullAddress,
        description: event.excerpt,
        calendarId,
      })
      setEventExported(true)
      showSnackbar({
        text: t('added'),
        positiveAction: {
          label: t('goToCalendar'),
          onPress: () => {
            openCalendarApp(event, id)
          },
        },
      })
    } catch {
      showSnackbar({ text: 'generalError' })
    }
  }

  const checkCalendarsAndExportEvent = async (): Promise<void> => {
    const checkedPermission = await RNCalendarEvents.checkPermissions()
    const permission =
      checkedPermission === 'undetermined' ? await RNCalendarEvents.requestPermissions() : checkedPermission
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
      exportEventToCalendar(editableCalendars[0]?.id)
    } else {
      setCalendars(editableCalendars)
      setShowCalendarChoiceModal(true)
    }
  }

  const chooseCalendar = async (id: string): Promise<void> => {
    setShowCalendarChoiceModal(false)
    await exportEventToCalendar(id).catch(() => showSnackbar({ text: 'generalError' }))
  }

  return (
    <>
      {!!calendars?.length && (
        <CalendarChoice
          closeModal={() => setShowCalendarChoiceModal(false)}
          modalVisible={showCalendarChoiceModal}
          chooseCalendar={chooseCalendar}
          calendars={calendars}
          eventTitle={event.title}
        />
      )}
      <Button
        title={t('addToCalendar')}
        onPress={checkCalendarsAndExportEvent}
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
