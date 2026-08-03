import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Divider from '@mui/material/Divider'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { withDividers } from '../utils'
import MenuItem from './MenuItem'

type MenuAccordionProps = {
  title: string
  items: ReactElement[]
  expanded: boolean
  setExpanded: (expanded: boolean) => void
  icon?: ReactElement
}

const MenuAccordion = ({ title, items, setExpanded, expanded, icon }: MenuAccordionProps): ReactElement => {
  const { t } = useTranslation('common')

  return (
    <>
      <MenuItem
        onClick={() => setExpanded(!expanded)}
        text={title}
        icon={icon}
        iconEnd={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        aria-label={t(expanded ? 'showLess' : 'showMore')}
      />
      {expanded && (
        <>
          <Divider />
          {withDividers(items)}
        </>
      )}
    </>
  )
}

export default MenuAccordion
