import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/native'

import { isCurrentlyOpen, weekdays } from 'shared'
import { OpeningHoursModel } from 'shared/api'

import Accordion from './Accordion'
import HoursList from './HoursList'
import Icon from './base/Icon'
import Text from './base/Text'

const StyledView = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`

type OfficeHoursProps = {
  officeHours: OpeningHoursModel[] | null
}

const OfficeHours = ({ officeHours }: OfficeHoursProps): ReactElement | null => {
  const { t } = useTranslation('pois')

  if (!officeHours || officeHours.length !== weekdays.length) {
    return null
  }

  const allDayOpen = officeHours.every(hours => hours.openAllDay)
  const allDayClosed = officeHours.every(hours => hours.closedAllDay)
  const currentlyOpen: boolean = isCurrentlyOpen(officeHours)

  if (allDayOpen) {
    return (
      <StyledView>
        <Icon source='clock-outline' size={24} />
        <Text>{t('allDay')}</Text>
      </StyledView>
    )
  }

  if (allDayClosed) {
    return (
      <StyledView>
        <Icon source='clock-outline' size={24} />
        <Text>{t('temporarilyClosed')}</Text>
      </StyledView>
    )
  }

  return (
    <Accordion
      headerContent={
        <StyledView>
          <Icon source='clock-outline' size={24} />
          <Text>{t(currentlyOpen ? 'opened' : 'closed')}</Text>
        </StyledView>
      }
      initialCollapsed>
      <HoursList hours={officeHours} appointmentUrl={null} />
    </Accordion>
  )
}

export default OfficeHours
