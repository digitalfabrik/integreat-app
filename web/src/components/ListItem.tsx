import React, { ReactElement, ReactNode } from 'react'
import styled from 'styled-components'

import CleanLink from './CleanLink'

const ListItemContainer = styled.div`
  border-bottom: 2px solid ${props => props.theme.colors.themeColor};
  display: flex;
`

const Thumbnail = styled.img`
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  padding: 15px 5px;
  object-fit: contain;
`

export const Description = styled.div`
  display: flex;
  height: 100%;
  min-width: 1px; /* needed to enable line breaks for too long words, exact value doesn't matter */
  flex-direction: column;
  flex-grow: 1;
  padding: 15px 10px 0;
  word-wrap: break-word;

  > * {
    padding-bottom: 10px;
  }
`

const Title = styled.div`
  font-weight: 700;
`

type PropsType = {
  thumbnail?: string
  path: string
  title: string
  children?: ReactNode
}

const ListItem: React.FC<PropsType> = ({ path, title, thumbnail, children }: PropsType): ReactElement => (
  <ListItemContainer>
    <CleanLink to={path}>
      {thumbnail && <Thumbnail alt='' src={thumbnail} />}
      <Description>
        <Title>{title}</Title>
        {children}
      </Description>
    </CleanLink>
  </ListItemContainer>
)

export default ListItem
