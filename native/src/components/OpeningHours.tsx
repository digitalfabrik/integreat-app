import { DateTime } from 'luxon'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Divider } from 'react-native-paper'
import styled, { useTheme } from 'styled-components/native'

import { weekdays } from 'shared'
import { OpeningHoursModel } from 'shared/api'

import { contentDirection } from '../constants/contentDirection'
import useSnackbar from '../hooks/useSnackbar'
import openExternalUrl from '../utils/openExternalUrl'
import Accordion from './Accordion'
import OpeningEntry from './OpeningEntry'
import Icon from './base/Icon'
import Text from './base/Text'

const Content = styled.View`
  font-size: 12px;
`

const TitleContainer = styled.View<{ language: string }>`
  flex-direction: ${props => contentDirection(props.language)};
  gap: 80px;
`

const LinkContainer = styled.Pressable`
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: center;
  padding-top: 4px;
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
  const theme = useTheme()
  return (
    <TitleContainer language={language}>
      <Text variant='h6' style={{ alignSelf: 'center' }}>
        {t('openingHours')}
      </Text>
      <Text
        variant='h6'
        style={{
          color: isCurrentlyOpen ? theme.colors.success : theme.colors.error,
          alignSelf: 'center',
          ...(contentDirection(language) === 'row-reverse' ? { paddingLeft: 12 } : { paddingRight: 12 }),
        }}>
        {t(label ?? (isCurrentlyOpen ? 'opened' : 'closed'))}
      </Text>
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
      <Text variant='body1' style={{ color: theme.colors.primary, textDecorationLine: 'underline' }}>
        {t('makeAppointment')}
      </Text>
      <Icon color={theme.colors.primary} size={16} source='open-in-new' />
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
      <Accordion
        headerContent={<OpeningHoursTitle isCurrentlyOpen={isCurrentlyOpen} language={language} />}
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
      </Accordion>
      {AppointmentLink}
      <StyledDivider />
    </>
  )
}

export default OpeningHours
