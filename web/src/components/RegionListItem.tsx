import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import React, { ReactElement } from 'react'

import { regionContentPath, normalizeString } from 'shared'
import { RegionModel } from 'shared/api'

import Highlighter from './Highlighter'
import Link from './base/Link'

const MAX_NUMBER_OF_ALIASES = 3

type RegionEntryProps = {
  language: string
  region: RegionModel
  filterText: string
}

const RegionListItem = ({ filterText, region, language }: RegionEntryProps): ReactElement => {
  const normalizedFilter = normalizeString(filterText)
  const aliases =
    region.aliases && normalizedFilter.length >= 1
      ? Object.keys(region.aliases).filter(alias => normalizeString(alias).includes(normalizedFilter))
      : []
  const aliasesText = aliases.slice(0, MAX_NUMBER_OF_ALIASES).join(', ')

  return (
    <ListItem alignItems='flex-start' disablePadding>
      <ListItemButton component={Link} to={regionContentPath({ regionCode: region.code, languageCode: language })}>
        <ListItemText
          primary={<Highlighter search={filterText} text={region.name} />}
          secondary={
            <>
              <Highlighter search={filterText} text={aliasesText} />
              {aliases.length > MAX_NUMBER_OF_ALIASES && <span> ... </span>}
            </>
          }
          slotProps={{
            secondary: {
              component: 'div',
            },
          }}
        />
      </ListItemButton>
    </ListItem>
  )
}

export default RegionListItem
