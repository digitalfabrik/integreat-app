import ListItem from '@mui/material/ListItem'
import ListSubheader, { ListSubheaderProps as MuiListSubheaderProps } from '@mui/material/ListSubheader'
import { styled } from '@mui/material/styles'
import React, { ElementType, ReactElement } from 'react'

import { CityModel } from 'shared/api'

import CityEntry from './CityEntry'
import List from './base/List'

type ListSubheaderProps<C extends ElementType> = MuiListSubheaderProps<C, { component?: C }> & {
  stickyTop: number
}

export const CityGroupHeader = <C extends ElementType>({
  stickyTop,
  children,
}: ListSubheaderProps<C>): ReactElement => (
  // We need to use sx here to avoid complications with the component prop
  // https://mui.com/material-ui/guides/typescript/#complications-with-the-component-prop
  <ListSubheader sx={{ top: stickyTop, transition: 'top 0.2s ease-out' }} component='div'>
    {children}
  </ListSubheader>
)

const StyledList = styled(List)`
  padding: 0;
` as typeof List

const StyledListItem = styled(ListItem)`
  flex-direction: column;
  padding-block: 0;
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
    <StyledList
      Header={<CityGroupHeader stickyTop={stickyTop}>{title}</CityGroupHeader>}
      items={cities}
      renderItem={city => <CityEntry key={city.code} city={city} language={languageCode} filterText={filterText} />}
      NoItemsMessage={NoItemsMessage}
    />
  </StyledListItem>
)

export default CityListGroup
