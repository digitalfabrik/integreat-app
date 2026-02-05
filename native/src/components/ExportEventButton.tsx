import { DateTime } from 'luxon'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform } from 'react-native'
import RNCalendarEvents, { Calendar, CalendarEventWritable, RecurrenceFrequency } from 'react-native-calendar-events'
import { Button } from 'react-native-paper'
import { PERMISSIONS, openSettings, requestMultiple } from 'react-native-permissions'
import { openSettings } from 'react-native-permissions'
import { Frequency } from 'rrule'

import { EventModel } from 'shared/api'

import useSnackbar from '../hooks/useSnackbar'
import { reportError } from '../utils/sentry'
import CalendarChoice from './CalendarChoiceModal'

type ExportEventButtonType = {
  event: EventModel
}

export const formatFrequency = (frequency: Frequency): RecurrenceFrequency =>
  Frequency[frequency].toLowerCase() as RecurrenceFrequency

const ExportEventButton = ({ event }: ExportEventButtonType): ReactElement => {
  const { t } = useTranslation('events')
  const showSnackbar = useSnackbar()

  const [showCalendarChoiceModal, setShowCalendarChoiceModal] = useState<boolean>(false)
  const [calendars, setCalendars] = useState<Calendar[]>()

  const exportEventToCalendar = async (calendarId: string, exportAll: boolean): Promise<void> => {
    // Luxon ISO dates have the time zone offset but Android calendar needs them in UTC
    let startDate = event.date.startDate.toUTC().toISO()
    let endDate = event.date.endDate?.toUTC().toISO()
    const allDay = event.date.allDay
    if (Platform.OS === 'android' && allDay) {
      // If allDay is set to true, Android demands that the time has a midnight boundary.
      // The endDate we receive from the CMS for allDay events is always at 23:59:00.
      startDate = event.date.startDate.toFormat("yyyy-LL-dd'T'00:00:00.000'Z'")
      endDate = event.date.endDate?.plus({ minutes: 1 }).toFormat("yyyy-LL-dd'T'00:00:00.000'Z'")
    }

    const eventOptions: CalendarEventWritable = {
      startDate,
      endDate,
      allDay,
      calendarId,
      location: event.location?.fullAddress,
      description: event.excerpt, // Android
      notes: event.excerpt, // iOS
      recurrenceRule:
        exportAll && event.date.recurrenceRule
          ? {
              endDate:
                event.date.recurrenceRule.options.until?.toISOString() ??
                DateTime.now().plus({ years: 3 }).toUTC().toISO(),
              frequency: formatFrequency(event.date.recurrenceRule.options.freq),
              interval: event.date.recurrenceRule.options.interval,
              // This gets overridden by `endDate and can't be set in the CMS anyway
              occurrence: 0,
              // @ts-expect-error https://github.com/wmcmahan/react-native-calendar-events/issues/159
              duration: null,
            }
          : undefined,
    }

    try {
      await RNCalendarEvents.saveEvent(event.title, eventOptions)
      showSnackbar({
        text: t('added'),
      })
    } catch (e) {
      showSnackbar({ text: 'generalError' })
      reportError(e)
    }
  }

  const chooseCalendar = async (id: string | undefined, exportAll: boolean): Promise<void> => {
    setShowCalendarChoiceModal(false)
    if (!id) {
      showSnackbar({ text: 'generalError' })
      return
    }
    try {
      await exportEventToCalendar(id, exportAll)
    } catch (e) {
      showSnackbar({ text: 'generalError' })
      reportError(e)
    }
  }

  const checkCalendarsAndExportEvent = async (): Promise<void> => {
    const authorizationStatus = await RNCalendarEvents.requestPermissions(false)

    if (authorizationStatus !== 'authorized') {
      showSnackbar({
        text: 'noCalendarPermission',
        positiveAction: {
          label: t('layout:settings'),
          onPress: openSettings,
        },
      })
      return
    }
    const editableCalendars = (await RNCalendarEvents.findCalendars()).filter(cal => cal.allowsModifications)

    if (editableCalendars.length === 0) {
      showSnackbar({ text: 'noCalendarFound' })
    } else if (editableCalendars.length > 1 || event.date.recurrenceRule) {
      setCalendars(editableCalendars)
      setShowCalendarChoiceModal(true)
    } else {
      // No choice needed (single calendar and non-recurring)
      await chooseCalendar(editableCalendars[0]?.id, false)
    }
  }

  return (
    <>
      {calendars && (
        <CalendarChoice
          closeModal={() => setShowCalendarChoiceModal(false)}
          modalVisible={showCalendarChoiceModal}
          chooseCalendar={chooseCalendar}
          calendars={calendars}
          eventTitle={event.title}
          recurring={!!event.date.recurrenceRule}
        />
      )}
      <Button icon='calendar-import' mode='text' style={{ marginVertical: 16 }} onPress={checkCalendarsAndExportEvent}>
        {t('addToCalendar')}
      </Button>
    </>
  )
}

export default ExportEventButton
