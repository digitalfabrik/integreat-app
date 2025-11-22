import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { useTheme } from 'styled-components/native'

import { isCurrentlyOpen, weekdays } from 'shared'
import { OpeningHoursModel } from 'shared/api'

import { ClockIcon } from '../assets'
import Collapsible from './Collapsible'
import HoursList from './HoursList'
import Icon from './base/Icon'
import Text from './base/Text'

const Container = styled.View`
  gap: 8px;
`

const StyledView = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`

const StyledTitle = styled(Text)`
  color: ${props => props.theme.colors.primary};
`

type OfficeHoursProps = {
  officeHours: OpeningHoursModel[] | null
  language: string
}

const OfficeHours = ({ officeHours, language }: OfficeHoursProps): ReactElement | null => {
  const { t } = useTranslation('pois')
  const theme = useTheme()

  if (!officeHours || officeHours.length !== weekdays.length) {
    return null
  }

  const allDayOpen = officeHours.every(hours => hours.allDay)
  const allDayClosed = officeHours.every(hours => hours.closed)
  const currentlyOpen = isCurrentlyOpen(officeHours)

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
    <Container>
      <StyledView>
        <Icon Icon={ClockIcon} />
        <Text>{t(currentlyOpen === true ? 'opened' : 'closed')}</Text>
      </StyledView>
      <Collapsible
        language={language}
        headerContent={<StyledTitle>{t('showHours')}</StyledTitle>}
        headerContentExpanded={<StyledTitle>{t('showLessHours')}</StyledTitle>}
        iconColor={theme.colors.primary}
        initialCollapsed>
        <HoursList hours={officeHours} appointmentUrl={null} language={language} />
      </Collapsible>
    </Container>
  )
}

export default OfficeHours
