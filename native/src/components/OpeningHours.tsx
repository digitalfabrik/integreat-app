import { DateTime } from 'luxon'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Text } from 'react-native'
import styled from 'styled-components/native'

import { weekdays } from 'shared'
import { OpeningHoursModel } from 'shared/api'

import { ExternalLinkIcon } from '../assets'
import { contentDirection } from '../constants/contentDirection'
import useSnackbar from '../hooks/useSnackbar'
import openExternalUrl from '../utils/openExternalUrl'
import Collapsible from './Collapsible'
import HorizontalLine from './HorizontalLine'
import OpeningEntry from './OpeningEntry'
import Icon from './base/Icon'

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

const LinkContainer = styled.Pressable`
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: center;
  padding-top: 4px;
`

const Link = styled.Text`
  font-size: 16px;
  color: ${props => props.theme.colors.linkColor};
  text-decoration: underline;
`

const StyledIcon = styled(Icon)`
  width: 16px;
  height: 16px;
`

type OpeningHoursProps = {
  isCurrentlyOpen: boolean
  language: string
  openingHours: OpeningHoursModel[] | null
  isTemporarilyClosed: boolean
  appointmentUrl: string | null
  link: string | null
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
  appointmentUrl,
  link,
}: OpeningHoursProps): ReactElement | null => {
  const { t } = useTranslation('pois')
  const showSnackbar = useSnackbar()

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
              appointmentOnly={entry.appointmentOnly}
              link={link}
            />
          ))}
          {appointmentUrl !== null && (
            <LinkContainer onPress={() => openExternalUrl(appointmentUrl, showSnackbar)} accessibilityRole='link'>
              <Link>{t('makeAppointment')}</Link>
              <StyledIcon Icon={ExternalLinkIcon} />
            </LinkContainer>
          )}
        </Content>
      </Collapsible>
      <HorizontalLine />
    </>
  )
}

export default OpeningHours
