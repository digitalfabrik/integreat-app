import moment from 'moment'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { ShelterModel } from 'api-client'

import bedIcon from '../assets/shelter/bed.svg'
import calendarIcon from '../assets/shelter/calendar.svg'
import houseIcon from '../assets/shelter/house.svg'
import timerIcon from '../assets/shelter/timer.svg'
import CleanLink from './CleanLink'

const Container = styled.article`
  flex: 1;
  margin: 12px;
  padding: 16px;
  background-color: #f8f8f8;
  flex-direction: column;
`

const Title = styled.span`
  padding: 16px 0;
  font-size: 18px;
  font-weight: 700;
`

const ID = styled.span`
  padding: 16px 0;
  margin: 0 8px;
  font-size: 18px;
  color: ${props => props.theme.colors.textSecondaryColor};
`

const Detail = styled.span`
  padding: 0 10px;
  flex-direction: row;
  width: 200px;
`

const Row = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`

const FreeLabel = styled.span`
  display: flex;
  padding: 0 8px;
  margin: auto 0 auto auto;
  background-color: #74d49e;
  border-radius: 4px;
  color: ${props => props.theme.colors.backgroundColor};
  font-size: 14px;
`

type ShelterDetailProps = {
  text: string
  icon: string
}

const ShelterDetail = ({ text, icon }: ShelterDetailProps): ReactElement => (
  <Detail>
    <img alt='' src={icon} />
    {text}
  </Detail>
)

type Props = {
  shelter: ShelterModel
}

const ShelterListItem = ({ shelter }: Props): ReactElement => {
  const { quarter, beds, city, id, accommodationType, period, startDate } = shelter
  const free = true
  const { t } = useTranslation('shelter')

  const location = quarter ?? city
  const bedsText = beds === 1 ? t('bed') : t('beds', { beds })
  const titleText = t('title', { beds: bedsText, location })
  const startDateText = moment(startDate, 'DD.MM.YYYY').isSameOrBefore(moment.now()) ? t('now') : startDate

  return (
    <CleanLink to={id.toString()}>
      <Container>
        <Row>
          <Title>{titleText}</Title>
          <ID>(#{id})</ID>
          {free && <FreeLabel>{t('free')}</FreeLabel>}
        </Row>
        <Row>
          <ShelterDetail text={t(accommodationType)} icon={houseIcon} />
          <ShelterDetail text={bedsText} icon={bedIcon} />
          <ShelterDetail text={startDateText} icon={calendarIcon} />
          <ShelterDetail text={t(period)} icon={timerIcon} />
        </Row>
      </Container>
    </CleanLink>
  )
}

export default ShelterListItem
