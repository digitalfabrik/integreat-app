import { fireEvent, waitFor } from '@testing-library/react-native'
import { DateTime } from 'luxon'
import React from 'react'
import { Text } from 'react-native'
import { rrulestr } from 'rrule'

import { EventModelBuilder, DateModel } from 'shared/api'

import render from '../../testing/render'
import ExportEventButton, { formatFrequency } from '../ExportEventButton'

const mockSaveEvent = jest.fn()
const mockFindCalendars = jest.fn()
const mockShowSnackbar = jest.fn()

jest.mock('react-native-calendar-events', () => ({
  __esModule: true,
  default: {
    saveEvent: (): Promise<void> => mockSaveEvent(),
    findCalendars: (): Promise<void> => mockFindCalendars(),
    requestPermissions: (): string => 'authorized',
  },
}))
jest.mock('../../hooks/useSnackbar', () => ({
  __esModule: true,
  default: () => mockShowSnackbar,
}))

jest.mock('../CalendarChoiceModal', () => ({
  __esModule: true,
  default: ({ modalVisible }: { modalVisible: boolean }) => (modalVisible ? <Text>CalendarChoiceModal</Text> : null),
}))

describe('formatFrequency', () => {
  it('should correctly return all frequencies that can be selected in the CMS', () => {
    expect(formatFrequency(3)).toBe('daily')
    expect(formatFrequency(2)).toBe('weekly')
    expect(formatFrequency(1)).toBe('monthly')
    expect(formatFrequency(0)).toBe('yearly')
  })
})

describe('ExportEventButton', () => {
  const language = 'de'
  const event = new EventModelBuilder('seed', 1, 'augsburg', language).build()[0]!

  beforeEach(() => {
    jest.clearAllMocks()
  })

  const createEvent = (rrule?: string) =>
    Object.assign(event, {
      _date: new DateModel({
        startDate: DateTime.fromISO('2026-01-01T07:00:00.000+02:00'),
        endDate: DateTime.fromISO('2026-01-30T09:00:00.000+02:00'),
        allDay: false,
        recurrenceRule: rrule ? rrulestr(rrule) : null,
        onlyWeekdays: false,
      }),
    })

  it('should auto-add to calendar if only one calendar and event is non-recurring', async () => {
    mockFindCalendars.mockResolvedValueOnce([
      { id: 'cal-1', title: 'My Calendar', allowsModifications: true, source: 'local' },
    ])

    const { getByText, queryByText } = render(<ExportEventButton event={createEvent()} />)

    fireEvent.press(getByText('addToCalendar'))

    expect(queryByText('CalendarChoiceModal')).toBeFalsy()

    await waitFor(() => expect(mockSaveEvent).toHaveBeenCalled())
    await waitFor(() => expect(mockShowSnackbar).toHaveBeenCalledWith({ text: 'added' }))
  })

  it('should show calendar selection if multiple calendars and event is non-recurring', async () => {
    mockFindCalendars.mockResolvedValueOnce([
      { id: 'cal-1', title: 'My Calendar', allowsModifications: true, source: 'local' },
      { id: 'cal-2', title: 'Work', allowsModifications: true, source: 'local' },
    ])

    const { getByText, findByText } = render(<ExportEventButton event={createEvent()} />)

    fireEvent.press(getByText('addToCalendar'))

    expect(await findByText('CalendarChoiceModal')).toBeTruthy()
    // No export yet user must choose calendar
    expect(mockSaveEvent).not.toHaveBeenCalled()
  })

  it('should show recurrence choice if only one calendar and event is recurring', async () => {
    mockFindCalendars.mockResolvedValueOnce([
      { id: 'cal-1', title: 'My Calendar', allowsModifications: true, source: 'local' },
    ])

    const { getByText, findByText } = render(
      <ExportEventButton event={createEvent('DTSTART:20260114T050000\nRRULE:FREQ=WEEKLY;BYDAY=MO')} />,
    )

    fireEvent.press(getByText('addToCalendar'))

    expect(await findByText('CalendarChoiceModal')).toBeTruthy()
    // No export yet user must choose one event or all future events
    expect(mockSaveEvent).not.toHaveBeenCalled()
  })
})
