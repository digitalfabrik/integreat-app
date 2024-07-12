import React, { ReactElement, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Modal as RNModal } from 'react-native'
import styled from 'styled-components/native'

import { TimeSlot } from 'shared/api/types'

import { NoteIcon } from '../assets'
import { contentDirection } from '../constants/contentDirection'
import Link from './Link'
import Icon from './base/Icon'

const BackgroundForClosing = styled.Pressable`
  flex: 1;
  background-color: ${props => props.theme.colors.textDecorationColor};
  opacity: 0.25;
`

const OverlayCenterer = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  justify-content: center;
  align-items: center;
`

const OverlayContainer = styled.View`
  background-color: white;
  margin: 32px;
  padding: 24px;
  border-radius: 28px;
`

const OverlayTitle = styled.Text`
  font-weight: 700;
  margin-bottom: 16px;
`

const OverlayContent = styled.Text`
  font-weight: 400;
`

const CloseButton = styled.Pressable`
  padding: 12px;
  margin-left: auto;
`

const CloseButtonText = styled.Text`
  font-weight: 700;
  color: ${props => props.theme.colors.textSecondaryColor};
`

type AppointmentOnlyOverlayProps = {
  link: string | null
  closeOverlay: () => void
}

const AppointmentOnlyOverlay = ({ link, closeOverlay }: AppointmentOnlyOverlayProps): ReactElement => {
  const { t } = useTranslation('pois')
  return (
    <RNModal onRequestClose={closeOverlay} animationType='fade' transparent>
      <BackgroundForClosing onPress={closeOverlay} />
      <OverlayCenterer>
        <OverlayContainer>
          <OverlayTitle>{t('appointmentNecessary')}</OverlayTitle>
          <OverlayContent>
            {link ? (
              // More information: https://react.i18next.com/latest/trans-component
              <Trans i18nKey='makeAppointmentTooltipWithLink' ns='pois'>
                This gets replaced by react-18next
                <Link url={link} text={t('theWebsite')} />
              </Trans>
            ) : (
              t('makeAppointmentTooltipWithoutLink')
            )}
          </OverlayContent>
          <CloseButton onPress={closeOverlay}>
            <CloseButtonText>{t('close', { ns: 'common' })}</CloseButtonText>
          </CloseButton>
        </OverlayContainer>
      </OverlayCenterer>
    </RNModal>
  )
}

const EntryContainer = styled.View<{ language: string }>`
  display: flex;
  flex-direction: ${props => contentDirection(props.language)};
  justify-content: space-between;
  padding: ${props => (contentDirection(props.language) === 'row' ? '4px 36px 4px 0' : '4px 26px 4px 0')};
`

const Timeslot = styled.View`
  display: flex;
  flex-direction: column;
`

const TimeSlotEntry = styled.Text<{ isCurrentDay: boolean; notFirstChild?: boolean }>`
  font-family: ${props =>
    props.isCurrentDay ? props.theme.fonts.native.contentFontBold : props.theme.fonts.native.contentFontRegular};
  ${props => props.notFirstChild && 'margin-top: 8px'};
`

const TimeSlotLabel = styled.Text<{ isCurrentDay: boolean }>`
  font-family: ${props =>
    props.isCurrentDay ? props.theme.fonts.native.contentFontBold : props.theme.fonts.native.contentFontRegular};
`

const AppointmentOnlyContainer = styled.View`
  position: absolute;
  right: -3px;
  top: 6px;
`

const StyledPressable = styled.Pressable`
  width: 24px;
  height: 24px;
`

const StyledIcon = styled(Icon)`
  height: 18px;
  width: 18px;
`

type OpeningEntryProps = {
  allDay: boolean
  closed: boolean
  timeSlots: TimeSlot[]
  weekday: string
  isCurrentDay: boolean
  language: string
  appointmentOnly: boolean
  link: string | null
}

const OpeningEntry = ({
  allDay,
  closed,
  timeSlots,
  weekday,
  isCurrentDay,
  language,
  appointmentOnly,
  link,
}: OpeningEntryProps): ReactElement => {
  const { t } = useTranslation('pois')

  const [overlayOpen, setOverlayOpen] = useState<boolean>(false)

  return (
    <EntryContainer language={language}>
      <TimeSlotLabel isCurrentDay={isCurrentDay}>{weekday}</TimeSlotLabel>
      {allDay && <TimeSlotEntry isCurrentDay={isCurrentDay}>{t('allDay')}</TimeSlotEntry>}
      {closed && <TimeSlotEntry isCurrentDay={isCurrentDay}>{t('closed')}</TimeSlotEntry>}
      {!allDay && !closed && timeSlots.length > 0 && (
        <Timeslot>
          {timeSlots.map((timeSlot, index) => (
            <TimeSlotEntry key={`${weekday}-${timeSlot.start}`} isCurrentDay={isCurrentDay} notFirstChild={index !== 0}>
              {timeSlot.start}-{timeSlot.end}
            </TimeSlotEntry>
          ))}
        </Timeslot>
      )}
      {appointmentOnly && (
        <AppointmentOnlyContainer>
          <StyledPressable onPress={() => setOverlayOpen(true)}>
            <StyledIcon Icon={NoteIcon} label={t('appointmentNecessary')} />
          </StyledPressable>
          {overlayOpen && <AppointmentOnlyOverlay closeOverlay={() => setOverlayOpen(false)} link={link} />}
        </AppointmentOnlyContainer>
      )}
    </EntryContainer>
  )
}

export default OpeningEntry
