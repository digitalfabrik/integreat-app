import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/native'

import { isCurrentlyOpen, weekdays } from 'shared'
import { OpeningHoursModel } from 'shared/api'

import { ClockIcon } from '../assets'
import Collapsible from './Collapsible'
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
  language: string
}

const OfficeHours = ({ officeHours, language }: OfficeHoursProps): ReactElement | null => {
  const { t } = useTranslation('pois')

  if (!officeHours || officeHours.length !== weekdays.length) {
    return null
  }

  const allDayOpen = officeHours.every(hours => hours.allDay)
  const allDayClosed = officeHours.every(hours => hours.closed)
  const currentlyOpen: boolean = isCurrentlyOpen(officeHours)

  if (allDayOpen) {
    return (
      <StyledView>
        <Icon Icon={ClockIcon} />
        <Text>{t('allDay')}</Text>
      </StyledView>
    )
  }

  if (allDayClosed) {
    return (
      <StyledView>
        <Icon Icon={ClockIcon} />
        <Text>{t('temporarilyClosed')}</Text>
      </StyledView>
    )
  }

  return (
    <Collapsible
      language={language}
      headerContent={
        <StyledView>
          <Icon Icon={ClockIcon} />
          <Text>{t(currentlyOpen ? 'opened' : 'closed')}</Text>
        </StyledView>
      }
      initialCollapsed>
      <HoursList hours={officeHours} appointmentUrl={null} language={language} />
    </Collapsible>
  )
}

export default OfficeHours
