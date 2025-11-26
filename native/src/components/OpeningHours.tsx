import { DateTime } from 'luxon'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Text } from 'react-native'
import { Divider } from 'react-native-paper'
import styled, { useTheme } from 'styled-components/native'

import { weekdays } from 'shared'
import { OpeningHoursModel } from 'shared/api'

import { contentDirection } from '../constants/contentDirection'
import useSnackbar from '../hooks/useSnackbar'
import openExternalUrl from '../utils/openExternalUrl'
import Collapsible from './Collapsible'
import OpeningEntry from './OpeningEntry'
import Icon from './base/Icon'

const OpeningLabel = styled.Text<{ isOpened: boolean; $direction: string }>`
  color: ${props =>
    props.isOpened ? props.theme.legacy.colors.positiveHighlight : props.theme.legacy.colors.negativeHighlight};
  ${props => (props.$direction === 'rtl' ? `padding-left: 12px;` : `padding-right: 12px;`)}
  font-weight: bold;
  align-self: center;
`

const StyledText = styled(Text)`
  color: ${props => props.theme.legacy.colors.textColor};
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
  color: ${props => props.theme.legacy.colors.linkColor};
  text-decoration: underline;
`

const StyledIcon = styled(Icon)`
  width: 16px;
  height: 16px;
`

const StyledDivider = styled(Divider)`
  margin: 20px 0;
`

type OpeningHoursTitleProps = {
  isCurrentlyOpen: boolean
  label?: string
  language: string
}

const OpeningHoursTitle = ({ isCurrentlyOpen, label, language }: OpeningHoursTitleProps) => {
  const { t } = useTranslation('pois')
  return (
    <TitleContainer language={language}>
      <StyledText>{t('openingHours')}</StyledText>
      <OpeningLabel isOpened={isCurrentlyOpen} $direction={contentDirection(language)}>
        {t(label ?? (isCurrentlyOpen ? 'opened' : 'closed'))}
      </OpeningLabel>
    </TitleContainer>
  )
}

type OpeningHoursProps = {
  isCurrentlyOpen: boolean
  language: string
  openingHours: OpeningHoursModel[] | null
  isTemporarilyClosed: boolean
  appointmentUrl: string | null
}

const OpeningHours = ({
  isCurrentlyOpen,
  language,
  openingHours,
  isTemporarilyClosed,
  appointmentUrl,
}: OpeningHoursProps): ReactElement | null => {
  const { t } = useTranslation('pois')
  const showSnackbar = useSnackbar()
  const theme = useTheme()
  const appointmentOnly = !openingHours && !!appointmentUrl

  const AppointmentLink = appointmentUrl ? (
    <LinkContainer onPress={() => openExternalUrl(appointmentUrl, showSnackbar)} role='link'>
      <Link>{t('makeAppointment')}</Link>
      <StyledIcon color={theme.colors.primary} source='open-in-new' />
    </LinkContainer>
  ) : null

  if (isTemporarilyClosed || appointmentOnly) {
    return (
      <>
        <OpeningHoursTitle
          isCurrentlyOpen={isCurrentlyOpen}
          label={isTemporarilyClosed ? 'temporarilyClosed' : 'onlyWithAppointment'}
          language={language}
        />
        {AppointmentLink}
        <StyledDivider />
      </>
    )
  }

  if (openingHours?.length !== weekdays.length) {
    return null
  }

  return (
    <>
      <Collapsible
        headerContent={<OpeningHoursTitle isCurrentlyOpen={isCurrentlyOpen} language={language} />}
        language={language}
        initialCollapsed={!isCurrentlyOpen}>
        <Content>
          {openingHours.map((openingHours, index) => (
            <OpeningEntry
              key={weekdays[index]}
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              weekday={t(weekdays[index]!)}
              isCurrentDay={index === DateTime.now().weekday - 1}
              language={language}
              appointmentUrl={appointmentUrl}
              openingHours={openingHours}
            />
          ))}
        </Content>
      </Collapsible>
      {AppointmentLink}
      <StyledDivider />
    </>
  )
}

export default OpeningHours
