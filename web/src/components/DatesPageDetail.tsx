import styled from '@emotion/styled'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { MAX_DATE_RECURRENCES } from 'shared'
import { DateModel } from 'shared/api'

import { CalendarIcon, CalendarTodayIcon, ClockIcon, ExpandIcon } from '../assets'
import dimensions from '../constants/dimensions'
import PageDetail from './PageDetail'
import Button from './base/Button'
import Icon from './base/Icon'

const Container = styled.div`
  display: grid;
  width: fit-content;
  gap: 8px 16px;

  @media ${dimensions.mediumLargeViewport} {
    grid-template-columns: auto auto;
  }
`

const ContainerForThreeElements = styled(Container)`
  @media ${dimensions.mediumLargeViewport} {
    & > :nth-child(3) {
      grid-column: 1 / 3;
    }
  }
`

const StyledButton = styled(Button)`
  justify-self: start;
  border-color: ${props => props.theme.colors.themeColor};
  border-width: 1px;
  border-style: solid;
  border-radius: 4px;
  padding: 4px 8px;
  display: flex;

  @media ${dimensions.mediumLargeViewport} {
    grid-column: 1 / 3;
  }
`

const StyledIcon = styled(Icon)`
  width: 16px;
  height: 16px;
  margin-inline-end: 8px;
`

type DatesPageDetailProps = {
  date: DateModel
}

const DatesPageDetail = ({ date }: DatesPageDetailProps): ReactElement | null => {
  const [clicksOnShowMore, setClicksOnShowMore] = React.useState(0)
  const { t } = useTranslation('events')

  if (date.isMonthlyOrYearlyRecurrence()) {
    return (
      <Container>
        {date
          .recurrences(MAX_DATE_RECURRENCES * (clicksOnShowMore + 1))
          .map(recurrence => recurrence.formatMonthlyOrYearlyRecurrence(t))
          .map(formattedDate => (
            <React.Fragment key={formattedDate.date}>
              <PageDetail icon={CalendarIcon} information={formattedDate.date} />
              <PageDetail icon={ClockIcon} information={formattedDate.time} />
            </React.Fragment>
          ))}
        <StyledButton type='button' onClick={() => setClicksOnShowMore(clicksOnShowMore + 1)}>
          <StyledIcon src={ExpandIcon} title='' />
          {t('common:showMore')}
        </StyledButton>
      </Container>
    )
  }

  const formattedDate = date.formatEventDate(t)

  return (
    <ContainerForThreeElements>
      <PageDetail icon={CalendarTodayIcon} information={formattedDate.date} />
      {formattedDate.weekday !== undefined && <PageDetail information={formattedDate.weekday} />}
      <PageDetail icon={ClockIcon} information={formattedDate.time} />
    </ContainerForThreeElements>
  )
}

export default DatesPageDetail
