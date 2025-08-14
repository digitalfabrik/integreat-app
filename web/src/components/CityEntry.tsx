import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import { styled } from '@mui/material/styles'
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
    <ListItem
      component={Link}
      to={cityContentPath({ cityCode: city.code, languageCode: language })}
      alignItems='flex-start'>
      <ListItemText
        primary={<Highlighter search={filterText} text={city.name} />}
        secondary={
          <>
            <Highlighter search={filterText} text={aliasesText} />
            {aliases.length > MAX_NUMBER_OF_ALIASES && <span> ... </span>}
          </>
        }
      />
    </ListItem>
  )
}

export default CityEntry
