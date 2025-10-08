import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import MuiAccordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { ReactElement, ReactNode, useState } from 'react'
import { useTranslation } from 'react-i18next'

const StyledAccordion = styled(MuiAccordion)({
  '&:before': {
    display: 'none',
  },
})

const StyledAccordionSummary = styled(AccordionSummary)({
  padding: 0,
})

const StyledAccordionDetails = styled(AccordionDetails)({
  overflowWrap: 'break-word',
})

type AccordionProps = {
  id: string
  children: ReactNode
  title: string | ReactElement
  description?: ReactElement
  defaultCollapsed?: boolean
}

const Accordion = ({ children, title, description, id, defaultCollapsed = false }: AccordionProps): ReactElement => {
  const [expanded, setExpanded] = useState(!defaultCollapsed)
  const { t } = useTranslation('common')

  return (
    <StyledAccordion
      disableGutters
      elevation={0}
      expanded={expanded}
      onChange={(_, isExpanded) => setExpanded(isExpanded)}
      slotProps={{ heading: { component: 'h2' } }}>
      <StyledAccordionSummary
        id={`${id}-header`}
        aria-controls={`${id}-content`}
        aria-label={t(expanded ? 'showLess' : 'showMore')}
        expandIcon={<ExpandMoreIcon />}
        tabIndex={0}>
        {typeof title === 'string' ? (
          <Typography component='span' variant='title3'>
            {title}
          </Typography>
        ) : (
          title
        )}
        {description}
      </StyledAccordionSummary>
      <StyledAccordionDetails>{children}</StyledAccordionDetails>
    </StyledAccordion>
  )
}

export default Accordion
