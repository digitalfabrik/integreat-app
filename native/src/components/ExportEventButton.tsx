import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, Platform } from 'react-native'
import RNCalendarEvents, { Calendar } from 'react-native-calendar-events'
import { PERMISSIONS, PermissionStatus, request, requestMultiple } from 'react-native-permissions'
import styled from 'styled-components/native'

import { EventModel } from 'api-client'

import useSnackbar from '../hooks/useSnackbar'
import { reportError } from '../utils/sentry'
import CalendarChoice from './CalendarChoiceModal'
import TextButton from './base/TextButton'

const StyledButton = styled(TextButton)`
  margin: 16px 0;
`

type ExportEventButtonType = {
  event: EventModel
}

const ExportEventButton = ({ event }: ExportEventButtonType): ReactElement => {
  const { t } = useTranslation('events')
  const showSnackbar = useSnackbar()

  const [eventExported, setEventExported] = useState<boolean>(false)
  const [showCalendarChoiceModal, setShowCalendarChoiceModal] = useState<boolean>(false)
  const [calendars, setCalendars] = useState<Calendar[]>()

  const exportEventToCalendar = async (calendarId: string | undefined): Promise<void> => {
    let startDate = event.date.startDate.toUTC().toString()
    let endDate = event.date.endDate.toUTC().toString()
    const allDay = event.date.allDay
    if (Platform.OS === 'android' && allDay) {
      // If allDay is set to true, Android demands that the time has a midnight boundary.
      // The endDate we receive from the CMS for allDay events is always at 23:59:00.
      startDate = event.date.startDate.toFormat("yyyy-LL-dd'T'00:00:00.000'Z'")
      endDate = event.date.endDate.plus({ minutes: 1 }).toFormat("yyyy-LL-dd'T'00:00:00.000'Z'")
    }

    try {
      await RNCalendarEvents.saveEvent(event.title, {
        startDate,
        endDate,
        allDay,
        calendarId,
        location: event.location?.fullAddress,
        description: event.excerpt, // Android
        notes: event.excerpt, // iOS
      })
      setEventExported(true)
      showSnackbar({
        text: t('added'),
      })
    } catch (e) {
      showSnackbar({ text: 'generalError' })
      reportError(e)
    }
  }

  const checkPermissionState = (
    permissions:
      | PermissionStatus
      | Record<'android.permission.READ_CALENDAR' | 'android.permission.WRITE_CALENDAR', PermissionStatus>,
    state: PermissionStatus,
  ): boolean => {
    if (typeof permissions === 'string') {
      return permissions === state
    }
    return Object.values(permissions).every(permission => permission === state)
  }

  const checkCalendarsAndExportEvent = async (): Promise<void> => {
    const iosPermission = PERMISSIONS.IOS.CALENDARS
    const androidPermissions = [PERMISSIONS.ANDROID.READ_CALENDAR, PERMISSIONS.ANDROID.WRITE_CALENDAR]
    const permission = Platform.OS === 'ios' ? await request(iosPermission) : await requestMultiple(androidPermissions)
    if (checkPermissionState(permission, 'limited') || checkPermissionState(permission, 'blocked')) {
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
    } else if (editableCalendars.length === 1 && 0 in editableCalendars) {
      try {
        await exportEventToCalendar(editableCalendars[0].id)
      } catch (e) {
        showSnackbar({ text: 'generalError' })
        reportError(e)
      }
    } else {
      setCalendars(editableCalendars)
      setShowCalendarChoiceModal(true)
    }
  }

  const chooseCalendar = async (id: string): Promise<void> => {
    setShowCalendarChoiceModal(false)
    try {
      await exportEventToCalendar(id)
    } catch (e) {
      showSnackbar({ text: 'generalError' })
      reportError(e)
    }
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
      <StyledButton text={t('addToCalendar')} onPress={checkCalendarsAndExportEvent} disabled={eventExported} />
    </>
  )
}

export default ExportEventButton
