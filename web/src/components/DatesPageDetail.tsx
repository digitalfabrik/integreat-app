import styled from '@emotion/styled'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import TodayIcon from '@mui/icons-material/TodayOutlined'
import React, { Fragment, ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { MAX_DATE_RECURRENCES } from 'shared'
import { DateModel } from 'shared/api'

import dimensions from '../constants/dimensions'
import PageDetail from './PageDetail'
import Button from './base/Button'

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
    & > :nth-of-type(3) {
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

type DatesPageDetailProps = {
  date: DateModel
  language: string
}

const DatesPageDetail = ({ date, language }: DatesPageDetailProps): ReactElement | null => {
  const [clicksOnShowMore, setClicksOnShowMore] = useState(0)
  const visibleRecurrences = MAX_DATE_RECURRENCES * (clicksOnShowMore + 1)
  const { t } = useTranslation('events')

  const recurrences = date
    .recurrences(visibleRecurrences)
    .map(recurrence => recurrence.formatMonthlyOrYearlyRecurrence(language, t))
    .map(formattedDate => (
      <Fragment key={formattedDate.date}>
        <PageDetail icon={<TodayIcon />} information={formattedDate.date} />
        <PageDetail icon={<AccessTimeIcon />} information={formattedDate.time} />
      </Fragment>
    ))

  if (date.isMonthlyOrYearlyRecurrence()) {
    return (
      <Container>
        {recurrences}
        {date.hasMoreRecurrencesThan(visibleRecurrences) && (
          <StyledButton type='button' onClick={() => setClicksOnShowMore(clicksOnShowMore + 1)}>
            <ExpandMoreIcon />
            {t('common:showMore')}
          </StyledButton>
        )}
      </Container>
    )
  }

  const formattedDate = date.formatEventDate(language, t)

  return (
    <ContainerForThreeElements>
      <PageDetail icon={<TodayIcon />} information={formattedDate.date} />
      {!!formattedDate.weekday && <PageDetail information={formattedDate.weekday} />}
      <PageDetail icon={<AccessTimeIcon />} information={formattedDate.time} />
    </ContainerForThreeElements>
  )
}

export default DatesPageDetail
