import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import React, { ReactElement } from 'react'

import { getExcerpt } from 'shared'

import { EXCERPT_MAX_CHARS } from '../constants'
import Highlighter from './Highlighter'
import Link from './base/Link'

type SearchListItemProps = {
  title: string
  contentWithoutHtml: string
  query: string
  path: string
}

const SearchListItem = ({ title, contentWithoutHtml, query, path }: SearchListItemProps): ReactElement => {
  const excerpt = getExcerpt(contentWithoutHtml, { query, maxChars: EXCERPT_MAX_CHARS })

  return (
    <ListItem disablePadding>
      <ListItemButton component={Link} to={path}>
        <ListItemText
          primary={<Highlighter search={query} text={title} />}
          secondary={excerpt.length > 0 && <Highlighter search={query} text={excerpt} />}
        />
      </ListItemButton>
    </ListItem>
  )
}

export default SearchListItem
