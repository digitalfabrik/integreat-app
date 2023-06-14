import moment from 'moment'
import React, { ReactElement, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, Platform, RefreshControl } from 'react-native'
import RNCalendarEvents, { Calendar } from 'react-native-calendar-events'
import { Button } from 'react-native-elements'
import styled, { useTheme } from 'styled-components/native'

import { CityModel, EventModel, EVENTS_ROUTE, fromError, NotFoundError, RouteInformationType } from 'api-client'

import CalendarChoice from '../components/CalendarChoice'
import Caption from '../components/Caption'
import EventListItem from '../components/EventListItem'
import Failure from '../components/Failure'
import { FeedbackInformationType } from '../components/FeedbackContainer'
import Layout from '../components/Layout'
import LayoutedScrollView from '../components/LayoutedScrollView'
import List from '../components/List'
import Page from '../components/Page'
import PageDetail from '../components/PageDetail'
import SiteHelpfulBox from '../components/SiteHelpfulBox'
import DateFormatterContext from '../contexts/DateFormatterContext'
import useSnackbar from '../hooks/useSnackbar'

const Separator = styled.View`
  border-top-width: 2px;
  border-top-color: ${props => props.theme.colors.themeColor};
`

const StyledSiteHelpfulBox = styled(SiteHelpfulBox)`
  margin-top: 0;
`

export type EventsProps = {
  slug?: string
  events: Array<EventModel>
  cityModel: CityModel
  language: string
  navigateTo: (routeInformation: RouteInformationType) => void
  navigateToFeedback: (feedbackInformation: FeedbackInformationType) => void
  refresh: () => void
}

/**
 * Displays a list of events or a single event, matching the route /<location>/<language>/events(/<id>)
 */
const Events = ({
  cityModel,
  language,
  navigateTo,
  events,
  slug,
  navigateToFeedback,
  refresh,
}: EventsProps): ReactElement => {
  const { t } = useTranslation('events')
  const formatter = useContext(DateFormatterContext)
  const theme = useTheme()
  const showSnackbar = useSnackbar()

  const [eventExported, setEventExported] = useState<boolean>(false)
  const [showCalendarChoiceOverlay, setShowCalendarChoiceOverlay] = useState<boolean>(false)
  const [calendars, setCalendars] = useState<Calendar[]>()

  const createNavigateToFeedback = (event?: EventModel) => (isPositiveFeedback: boolean) => {
    navigateToFeedback({
      routeType: EVENTS_ROUTE,
      slug: event?.slug,
      cityCode: cityModel.code,
      language,
      isPositiveFeedback,
    })
  }

  if (!cityModel.eventsEnabled) {
    const error = new NotFoundError({
      type: 'category',
      id: 'events',
      city: cityModel.code,
      language,
    })
    return (
      <LayoutedScrollView refreshControl={<RefreshControl onRefresh={refresh} refreshing={false} />}>
        <Failure code={fromError(error)} />
      </LayoutedScrollView>
    )
  }

  if (slug) {
    // TODO IGAPP-1078: Remove workaround of looking up path until '$'
    const event =
      events.find(it => it.slug === slug) ?? events.find(it => it.slug.substring(0, it.slug.indexOf('$')) === slug)

    if (event) {
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
          showSnackbar({ text: 'generalError' })
        } else if (editableCalendars.length === 1) {
          saveEventToCalendar(editableCalendars[0]?.id)
        } else {
          setCalendars(editableCalendars)
          setShowCalendarChoiceOverlay(true)
        }
      }

      return (
        <LayoutedScrollView refreshControl={<RefreshControl onRefresh={refresh} refreshing={false} />}>
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
          <Page
            content={event.content}
            title={event.title}
            lastUpdate={event.lastUpdate}
            language={language}
            path={event.path}
            navigateToFeedback={createNavigateToFeedback(event)}
            BeforeContent={
              <>
                <PageDetail
                  identifier={t('date')}
                  information={event.date.toFormattedString(formatter)}
                  language={language}
                />
                {event.location && (
                  <PageDetail identifier={t('address')} information={event.location.fullAddress} language={language} />
                )}
              </>
            }
            pageFooter={
              <Button
                title={t('addToCalendar')}
                onPress={checkCalendarsAndSaveEvent}
                buttonStyle={{
                  backgroundColor: theme.colors.themeColor,
                  marginTop: 20,
                }}
                titleStyle={{
                  color: theme.colors.textColor,
                  fontFamily: theme.fonts.native.contentFontRegular,
                }}
                disabled={eventExported}
              />
            }
          />
        </LayoutedScrollView>
      )
    }

    const error = new NotFoundError({
      type: 'event',
      id: slug,
      city: cityModel.code,
      language,
    })
    return <Failure code={fromError(error)} />
  }

  const renderEventListItem = ({ item }: { item: EventModel }) => {
    const navigateToEvent = () =>
      navigateTo({
        route: EVENTS_ROUTE,
        cityCode: cityModel.code,
        languageCode: language,
        slug: item.slug,
      })
    return (
      <EventListItem
        key={item.slug}
        formatter={formatter}
        event={item}
        language={language}
        navigateToEvent={navigateToEvent}
      />
    )
  }

  return (
    <Layout>
      <List
        items={events}
        renderItem={renderEventListItem}
        Header={
          <>
            <Caption title={t('events')} />
            <Separator />
          </>
        }
        Footer={<StyledSiteHelpfulBox navigateToFeedback={createNavigateToFeedback()} />}
        refresh={refresh}
        noItemsMessage={t('currentlyNoEvents')}
      />
    </Layout>
  )
}

export default Events
