import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import React, { ReactElement } from 'react'

import { cityContentPath, normalizeString } from 'shared'
import { CityModel } from 'shared/api'

import Highlighter from './Highlighter'
import Link from './base/Link'

const MAX_NUMBER_OF_ALIASES = 3

type CityEntryProps = {
  language: string
  city: CityModel
  filterText: string
}

const CityEntry = ({ filterText, city, language }: CityEntryProps): ReactElement => {
  const normalizedFilter = normalizeString(filterText)
  const aliases =
    city.aliases && normalizedFilter.length >= 1
      ? Object.keys(city.aliases).filter(alias => normalizeString(alias).includes(normalizedFilter))
      : []
  const aliasesText = aliases.slice(0, MAX_NUMBER_OF_ALIASES).join(', ')

  return (
    <ListItem alignItems='flex-start' disablePadding>
      <ListItemButton component={Link} to={cityContentPath({ cityCode: city.code, languageCode: language })}>
        <ListItemText
          primary={<Highlighter search={filterText} text={city.name} />}
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

export default CityEntry
