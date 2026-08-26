import React, { ReactElement, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { SectionList } from 'react-native'
import { Divider, List as PaperList } from 'react-native-paper'
import styled, { useTheme } from 'styled-components/native'

import { eventGroupTitle, groupEventsByDate, RouteInformationType } from 'shared'
import { RegionModel, EventModel } from 'shared/api'

import Caption from '../components/Caption'
import EventListItem from '../components/EventListItem'
import EventsDateFilter from '../components/EventsDateFilter'
import Layout from '../components/Layout'
import { contentAlignment } from '../constants/contentDirection'
import useDateFilter from '../hooks/useDateFilter'
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
  const { t } = useTranslation(['events'], { lng: language })
  const { startDate, setStartDate, endDate, setEndDate, filteredEvents, startDateError } = useDateFilter(events)

  const sections = useMemo<EventSection[]>(() => {
    if (startDate || endDate) {
      return filteredEvents.length ? [{ title: null, data: filteredEvents }] : []
    }

    return groupEventsByDate(events).map(([key, events]) => {
      const [titleKey, params] = eventGroupTitle(key)
      return { title: t($ => $.events[titleKey], params), data: events }
    })
  }, [events, filteredEvents, startDate, endDate, t])

  const renderEventListItem = ({ item }: { item: EventModel }) => (
    <EventListItem
      event={item}
      language={language}
      navigateTo={navigateTo}
      regionCode={regionModel.code}
      filterStartDate={startDate}
      filterEndDate={endDate}
    />
  )

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
        keyExtractor={item => item.slug}
        renderItem={renderEventListItem}
        renderSectionHeader={renderSectionHeader}
        stickySectionHeadersEnabled
        ListHeaderComponent={
          <>
            <Caption title={t($ => $.events.events)} />
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
        ListEmptyComponent={<ListEmptyComponent noItemsMessage={t($ => $.events.currentlyNoEvents)} />}
        refreshing={false}
        onRefresh={refresh}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={Divider}
      />
    </ListContainer>
  )
}

export default EventList
