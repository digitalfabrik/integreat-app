import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary, { accordionSummaryClasses } from '@mui/material/AccordionSummary'
import Divider from '@mui/material/Divider'
import MuiMenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'

import { withDividers } from '../utils'

const StyledAccordion = styled(Accordion)({
  margin: 0,
  background: 'transparent',

  '&:before': {
    display: 'none',
  },
})

const StyledAccordionSummary = styled(AccordionSummary)({
  padding: '6px 16px',
  minHeight: 0,

  [`.${accordionSummaryClasses.content}`]: {
    margin: 0,
  },
}) as typeof AccordionSummary

const StyledAccordionDetails = styled(AccordionDetails)({
  paddingBlock: 0,
})

type MenuAccordionProps = {
  title: string
  items: ReactElement[]
}

const MenuAccordion = ({ title, items }: MenuAccordionProps): ReactElement => (
  <StyledAccordion
    elevation={0}
    defaultExpanded={false}
    disableGutters
    slotProps={{
      heading: {
        component: 'div',
      },
    }}>
    <StyledAccordionSummary component={MuiMenuItem} expandIcon={<ExpandMoreIcon />}>
      <Typography variant='body1'>{title}</Typography>
    </StyledAccordionSummary>
    <Divider />
    <StyledAccordionDetails>{withDividers(items)}</StyledAccordionDetails>
  </StyledAccordion>
)

export default MenuAccordion
