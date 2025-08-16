import shouldForwardProp from '@emotion/is-prop-valid'
import ListItem from '@mui/material/ListItem'
import ListSubheader from '@mui/material/ListSubheader'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'

import { CityModel } from 'shared/api'

import CityEntry from './CityEntry'
import List from './base/List'

export const StyledListSubheader = styled(ListSubheader, { shouldForwardProp })<{ stickyTop: number }>`
  top: ${props => props.stickyTop}px;
  transition: top 0.2s ease-out;
`

const StyledListItem = styled(ListItem)`
  flex-direction: column;
`

type CityListGroupProps = {
  title: string
  cities: CityModel[]
  stickyTop: number
  languageCode: string
  filterText: string
  NoItemsMessage?: string | ReactElement
}

const CityListGroup = ({
  title,
  cities,
  stickyTop,
  filterText,
  languageCode,
  NoItemsMessage = 'search:nothingFound',
}: CityListGroupProps): ReactElement => (
  <StyledListItem key={title} alignItems='flex-start'>
    <List
      Header={<StyledListSubheader stickyTop={stickyTop}>{title}</StyledListSubheader>}
      items={cities}
      renderItem={city => <CityEntry key={city.code} city={city} language={languageCode} filterText={filterText} />}
      NoItemsMessage={NoItemsMessage}
    />
  </StyledListItem>
)

export default CityListGroup
