import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary, { accordionSummaryClasses } from '@mui/material/AccordionSummary'
import Divider from '@mui/material/Divider'
import ListItemIcon from '@mui/material/ListItemIcon'
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
    alignItems: 'center',
  },
}) as typeof AccordionSummary

const StyledAccordionDetails = styled(AccordionDetails)({
  paddingBlock: 0,
})

type MenuAccordionProps = {
  title: string
  items: ReactElement[]
  expanded: boolean
  setExpanded: (expanded: boolean) => void
  icon?: ReactElement
}

const MenuAccordion = ({ title, items, setExpanded, expanded, icon }: MenuAccordionProps): ReactElement => (
  <StyledAccordion
    onChange={(_, isExpanded) => setExpanded(isExpanded)}
    expanded={expanded}
    elevation={0}
    defaultExpanded={false}
    disableGutters
    slotProps={{
      heading: {
        component: 'div',
      },
    }}>
    <StyledAccordionSummary component={MuiMenuItem} expandIcon={<ExpandMoreIcon />}>
      {icon && <ListItemIcon>{icon}</ListItemIcon>}
      <Typography variant='body1'>{title}</Typography>
    </StyledAccordionSummary>
    <Divider />
    <StyledAccordionDetails>{withDividers(items)}</StyledAccordionDetails>
  </StyledAccordion>
)

export default MenuAccordion
