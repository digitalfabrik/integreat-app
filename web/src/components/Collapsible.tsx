import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { buttonBaseClasses } from '@mui/material'
import Accordion, { accordionClasses } from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary, { accordionSummaryClasses } from '@mui/material/AccordionSummary'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

const StyledAccordion = styled(Accordion)({
  '&:before': {
    display: 'none',
  },
})

const StyledAccordionSummary = styled(AccordionSummary)({
  padding: 0,

  [`.${accordionSummaryClasses.content}`]: {
    margin: 0,
  },
})

const StyledAccordionDetails = styled(AccordionDetails)({
  padding: 0,

  [`.${accordionSummaryClasses.root}`]: {},
})

type CollapsibleProps = {
  children: ReactElement | string | number
  title: string | ReactElement
  Description?: ReactElement
  defaultExpanded?: boolean
  className?: string
}

const Collapsible = ({
  children,
  title,
  Description,
  defaultExpanded = true,
  className,
}: CollapsibleProps): ReactElement => {
  const [expanded, setExpanded] = useState<boolean>(defaultExpanded)
  const { t } = useTranslation('common')

  return (
    <StyledAccordion
      disableGutters
      elevation={0}
      expanded={expanded}
      onChange={(_, isExpanded) => setExpanded(isExpanded)}>
      <StyledAccordionSummary
        aria-label={t(expanded ? 'showLess' : 'showMore')}
        expandIcon={<ExpandMoreIcon />}
        tabIndex={0}>
        {typeof title === 'string' ? <Typography component='span'>{title}</Typography> : title}
      </StyledAccordionSummary>
      {Description}
      <StyledAccordionDetails>{expanded && children}</StyledAccordionDetails>
    </StyledAccordion>
  )
}

export default Collapsible
