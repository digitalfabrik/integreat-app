import { DateTime } from 'luxon'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Text } from 'react-native'
import styled from 'styled-components/native'

import { weekdays } from 'shared'
import { OpeningHoursModel } from 'shared/api'

import { contentDirection } from '../constants/contentDirection'
import Collapsible from './Collapsible'
import HorizontalLine from './HorizontalLine'
import OpeningEntry from './OpeningEntry'

const OpeningLabel = styled.Text<{ isOpened: boolean; $direction: string }>`
  color: ${props => (props.isOpened ? props.theme.colors.positiveHighlight : props.theme.colors.negativeHighlight)};
  ${props => (props.$direction === 'rtl' ? `padding-left: 12px;` : `padding-right: 12px;`)}
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
    return 'temporarilyClosed'
  }
  return isCurrentlyOpened ? 'opened' : 'closed'
}

const OpeningHours = ({
  isCurrentlyOpen,
  language,
  openingHours,
  isTemporarilyClosed,
}: OpeningHoursProps): ReactElement | null => {
  const { t } = useTranslation('pois')

  const openingHoursTitle = (
    <TitleContainer language={language}>
      <Text style={{ fontWeight: 'bold', alignSelf: 'center' }}>{t('openingHours')}</Text>
      <OpeningLabel isOpened={isCurrentlyOpen} $direction={contentDirection(language)}>
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

  if (!openingHours || openingHours.length !== weekdays.length) {
    return null
  }

  return (
    <>
      <Collapsible headerContent={openingHoursTitle} language={language}>
        <Content>
          {openingHours.map((entry, index) => (
            <OpeningEntry
              key={`${weekdays[index]}-OpeningEntry`}
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              weekday={t(weekdays[index]!)}
              allDay={entry.allDay}
              closed={entry.closed}
              timeSlots={entry.timeSlots}
              isCurrentDay={index === DateTime.now().weekday - 1}
              language={language}
            />
          ))}
        </Content>
      </Collapsible>
      <HorizontalLine />
    </>
  )
}

export default OpeningHours
