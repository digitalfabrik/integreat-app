import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { SectionList } from 'react-native'
import { Divider, List as PaperList } from 'react-native-paper'
import styled, { useTheme } from 'styled-components/native'

import { EVENTS_ROUTE, groupEventsByDate, RouteInformationType, useDateFilter } from 'shared'
import { RegionModel, EventModel } from 'shared/api'

import Caption from '../components/Caption'
import EventListItem from '../components/EventListItem'
import EventsDateFilter from '../components/EventsDateFilter'
import Layout from '../components/Layout'
import { contentAlignment } from '../constants/contentDirection'
import { ListEmptyComponent } from './List'

const ListContainer = styled(Layout)`
  padding: 0 8px;
`

type EventSection = {
  title: string | null
  data: EventModel[]
}

type EventListProps = {
  events: EventModel[]
  regionModel: RegionModel
  language: string
  navigateTo: (routeInformation: RouteInformationType) => void
  refresh: () => void
}

const EventList = ({ events, regionModel, language, navigateTo, refresh }: EventListProps): ReactElement => {
  const theme = useTheme()
  const { t } = useTranslation('events', { lng: language })
  const { startDate, setStartDate, endDate, setEndDate, filteredEvents, startDateError } = useDateFilter(events)

  let sections: EventSection[]
  if (startDate || endDate) {
    sections = filteredEvents.length > 0 ? [{ title: null, data: filteredEvents }] : []
  } else {
    sections = groupEventsByDate(events).map(([key, events]) => ({ title: t(key), data: events }))
  }

  const renderEventListItem = ({ item }: { item: EventModel }) => {
    const navigateToEvent = () =>
      navigateTo({
        route: EVENTS_ROUTE,
        regionCode: regionModel.code,
        languageCode: language,
        slug: item.slug,
      })

    return (
      <EventListItem
        event={item}
        language={language}
        navigateToEvent={navigateToEvent}
        filterStartDate={startDate}
        filterEndDate={endDate}
      />
    )
  }

  const renderSectionHeader = ({ section }: { section: EventSection }) =>
    section.title ? (
      <PaperList.Subheader style={{ textAlign: contentAlignment(language), backgroundColor: theme.colors.background }}>
        {section.title}
      </PaperList.Subheader>
    ) : null

  return (
    <ListContainer>
      <SectionList
        sections={sections}
        renderItem={renderEventListItem}
        renderSectionHeader={renderSectionHeader}
        stickySectionHeadersEnabled
        ListHeaderComponent={
          <>
            <Caption title={t('events')} />
            <EventsDateFilter
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              startDateError={startDateError}
              languageCode={language}
            />
          </>
        }
        ListEmptyComponent={<ListEmptyComponent noItemsMessage={t('currentlyNoEvents')} />}
        refreshing={false}
        onRefresh={refresh}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={Divider}
      />
    </ListContainer>
  )
}

export default EventList
