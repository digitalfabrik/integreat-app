import { TFunction } from 'i18next'
import { DateTime } from 'luxon'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { RefreshControl } from 'react-native'
import styled from 'styled-components/native'

import { EVENTS_ROUTE, RouteInformationType } from 'shared'
import { fromError, NotFoundError, CityModel, EventModel } from 'shared/api'
import useDateFilter from 'shared/hooks/useDateFilter'

import { CloseIcon, ShrinkIcon, ExpandIcon } from '../assets'
import CalendarRangeModal from '../components/CalendarRangeModal'
import Caption from '../components/Caption'
import CustomDatePicker from '../components/CustomDatePicker'
import DatesPageDetail from '../components/DatesPageDetail'
import EventListItem from '../components/EventListItem'
import ExportEventButton from '../components/ExportEventButton'
import Failure from '../components/Failure'
import Layout from '../components/Layout'
import LayoutedScrollView from '../components/LayoutedScrollView'
import List from '../components/List'
import Page from '../components/Page'
import PageDetail from '../components/PageDetail'
import Icon from '../components/base/Icon'
import Text from '../components/base/Text'

const ListContainer = styled(Layout)`
  padding: 0 8px;
`

const Separator = styled.View`
  border-top-width: 2px;
  border-top-color: ${props => props.theme.colors.themeColor};
`

const PageDetailsContainer = styled.View`
  gap: 8px;
`
const DateSection = styled.View`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 0px 5px 15px 5px;
  justify-content: center;
  align-items: center;
`
const StyledButton = styled.TouchableOpacity`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;
  justify-content: center;
`
const StyledText = styled(Text)`
  font-weight: bold;
  padding: 5px;
`
export type EventsProps = {
  slug?: string
  events: Array<EventModel>
  cityModel: CityModel
  language: string
  navigateTo: (routeInformation: RouteInformationType) => void
  refresh: () => void
}
export type ResetFilterTextProps = {
  fromDate: string
  toDate: string
  defaultFromDate: string
  defaultToDate: string
  t: TFunction<'events', undefined>
}
const ResetFilterText = ({ fromDate, toDate, defaultFromDate, defaultToDate, t }: ResetFilterTextProps) => {
  let Title = ''
  try {
    Title = `${t('resetFilter')} ${DateTime.fromISO(fromDate).toFormat('dd/MM/yy')} - ${DateTime.fromISO(toDate).toFormat('dd/MM/yy')}`
  } catch (e) {
    Title = `${t('resetFilter')} ${DateTime.fromISO(defaultFromDate).toFormat('dd/MM/yy')} - ${DateTime.fromISO(defaultToDate).toFormat('dd/MM/yy')}`
  }
  return <StyledText>{Title}</StyledText>
}

const DateFilterToggle = ({
  toggle,
  setToggleDateFilter,
}: {
  toggle: boolean
  setToggleDateFilter: React.Dispatch<React.SetStateAction<boolean>>
}) => (
  <StyledButton style={{ alignSelf: 'flex-start' }} onPress={() => setToggleDateFilter((prev: boolean) => !prev)}>
    <Icon Icon={toggle ? ShrinkIcon : ExpandIcon} />
    {toggle ? <StyledText>Hide filters</StyledText> : <StyledText>Show filters</StyledText>}
  </StyledButton>
)
const Events = ({ cityModel, language, navigateTo, events, slug, refresh }: EventsProps): ReactElement => {
  const { t } = useTranslation('events')
  const { fromDate, setFromDate, toDate, setToDate, filteredEvents, fromDateError, toDateError } = useDateFilter(events)
  const [modalState, setModalState] = useState(false)
  const defaultFromDate = DateTime.local().toFormat('yyyy-MM-dd').toLocaleString()
  const defaultToDate = DateTime.local().plus({ day: 10 }).toFormat('yyyy-MM-dd').toLocaleString()
  const [toggleDateFilter, setToggleDateFilter] = useState(true)
  const isReset = fromDate === defaultFromDate && toDate === defaultToDate

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
    const event = events.find(it => it.slug === slug)

    if (event) {
      return (
        <LayoutedScrollView refreshControl={<RefreshControl onRefresh={refresh} refreshing={false} />}>
          <Page
            content={event.content}
            title={event.title}
            lastUpdate={event.lastUpdate}
            language={language}
            path={event.path}
            BeforeContent={
              <PageDetailsContainer>
                <DatesPageDetail date={event.date} languageCode={language} />
                {event.location && (
                  <PageDetail identifier={t('address')} information={event.location.fullAddress} language={language} />
                )}
              </PageDetailsContainer>
            }
            Footer={<ExportEventButton event={event} />}
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
    return <EventListItem key={item.slug} event={item} language={language} navigateToEvent={navigateToEvent} />
  }

  return (
    <>
      <CalendarRangeModal
        closeModal={() => setModalState(false)}
        title='Select Range'
        modalVisible={modalState}
        fromDate={fromDate}
        toDate={toDate}
        setToDate={setToDate}
        setFromDate={setFromDate}
      />
      <ListContainer>
        <List
          items={filteredEvents}
          renderItem={renderEventListItem}
          Header={
            <>
              <Caption title={t('events')} />
              <DateSection>
                <DateFilterToggle toggle={toggleDateFilter} setToggleDateFilter={setToggleDateFilter} />
                {toggleDateFilter && (
                  <>
                    <CustomDatePicker
                      setModalState={setModalState}
                      setValue={setFromDate}
                      title={t('from')}
                      error={(fromDateError as string) || ''}
                      value={fromDate}
                    />
                    <CustomDatePicker
                      setModalState={setModalState}
                      setValue={setToDate}
                      title={t('to')}
                      error={(toDateError as string) || ''}
                      value={toDate}
                    />
                  </>
                )}
              </DateSection>
              <>
                {!isReset && toggleDateFilter && (
                  <StyledButton
                    onPress={() => {
                      setFromDate(defaultFromDate)
                      setToDate(defaultToDate)
                    }}>
                    <Icon Icon={CloseIcon} />
                    <ResetFilterText
                      fromDate={fromDate}
                      toDate={toDate}
                      t={t}
                      defaultFromDate={defaultFromDate}
                      defaultToDate={defaultToDate}
                    />
                  </StyledButton>
                )}
              </>
              <Separator />
            </>
          }
          refresh={refresh}
          noItemsMessage={t('currentlyNoEvents')}
        />
      </ListContainer>
    </>
  )
}

export default Events
