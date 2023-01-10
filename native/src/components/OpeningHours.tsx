import moment from 'moment'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Text } from 'react-native'
import styled from 'styled-components/native'

import { OpeningHoursModel } from 'api-client'

import { contentDirection } from '../constants/contentDirection'
import CollapsibleItem from './CollapsibleItem'
import HorizontalLine from './HorizontalLine'
import OpeningEntry from './OpeningEntry'

const OpeningLabel = styled.Text<{ isOpened: boolean; direction: string }>`
  color: ${props => (props.isOpened ? props.theme.colors.positiveHighlight : props.theme.colors.negativeHighlight)};
  ${props => (props.direction === 'rtl' ? `padding-left: 12px;` : `padding-right: 12px;`)}
  font-weight: bold;
  align-self: center;
`

const Content = styled.View`
  font-size: 12px;
`

const TitleContainer = styled.View<{ language: string }>`
  display: flex;
  flex: 1;
  font-weight: 700;
  font-size: 12px;
  justify-content: space-between;
  flex-direction: ${props => contentDirection(props.language)};
`

type OpeningHoursProps = {
  isCurrentlyOpen: boolean
  language: string
  openingHours: OpeningHoursModel[] | null
  isTemporarilyClosed: boolean
}

const getOpeningLabel = (isTemporarilyClosed: boolean, isCurrentlyOpened: boolean): string => {
  if (isTemporarilyClosed) {
    return 'openingHoursTemporarilyClosed'
  }
  if (isCurrentlyOpened) {
    return 'openingHoursOpened'
  }
  return 'openingHoursClosed'
}
const OpeningHours = ({
  isCurrentlyOpen,
  language,
  openingHours,
  isTemporarilyClosed,
}: OpeningHoursProps): ReactElement | null => {
  const { t } = useTranslation('pois')

  // The opening hours loaded from the cms are ordered according to the german weekday order
  // @ts-expect-error Interface has wrong type, supplying true is necessary and works
  const weekdays = moment.localeData('de').weekdays(true)

  const openingHoursTitle = (
    <TitleContainer language={language}>
      <Text style={{ fontWeight: 'bold', alignSelf: 'center' }}>{t('openingHours')}</Text>
      <OpeningLabel isOpened={isCurrentlyOpen} direction={contentDirection(language)}>
        {t(getOpeningLabel(isTemporarilyClosed, isCurrentlyOpen))}
      </OpeningLabel>
    </TitleContainer>
  )

  if (isTemporarilyClosed) {
    return (
      <>
        <TitleContainer language={language}>{openingHoursTitle}</TitleContainer>
        <HorizontalLine />
      </>
    )
  }
  if (!openingHours) {
    return null
  }
  return (
    <>
      <CollapsibleItem headerContent={openingHoursTitle} language={language} initExpanded>
        <Content>
          {openingHours.map((entry, index) => (
            <OpeningEntry
              key={`${weekdays[index]!}-OpeningEntry`}
              weekday={t(weekdays[index]!.toLowerCase())}
              allDay={entry.allDay}
              closed={entry.closed}
              timeSlots={entry.timeSlots}
              isCurrentDay={index === moment().isoWeekday() - 1}
              language={language}
            />
          ))}
        </Content>
      </CollapsibleItem>
      <HorizontalLine />
    </>
  )
}

export default OpeningHours
