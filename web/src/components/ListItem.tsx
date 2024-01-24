import React, { ReactElement, ReactNode } from 'react'
import styled from 'styled-components'

import { StyledCleanLink } from './CleanLink'

const ListItemContainer = styled.article`
  border-bottom: 2px solid ${props => props.theme.colors.themeColor};
  display: flex;
`

const Thumbnail = styled.img<{ thumbnailSize?: number }>`
  width: ${props => props.thumbnailSize ?? '100'}px;
  height: ${props => props.thumbnailSize ?? '100'}px;
  flex-shrink: 0;
  padding: 15px 5px;
  object-fit: contain;
  align-self: center;
`

export const Description = styled.div`
  display: flex;
  height: 100%;
  min-width: 1px; /* needed to enable line breaks for too long words, exact value doesn't matter */
  flex-direction: column;
  flex-grow: 1;
  padding: 8px;
  overflow-wrap: anywhere;
  gap: 8px;
`

const Title = styled.div`
  font-weight: 700;
`

const FullWidthLink = styled(StyledCleanLink)`
  flex: 1;
`

const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;
`

type ListItemProps = {
  thumbnail?: string
  thumbnailSize?: number
  path: string
  title: string
  Icon?: ReactNode
  children?: ReactNode
}

const ListItem = ({ path, title, thumbnail, thumbnailSize, children, Icon }: ListItemProps): ReactElement => (
  <ListItemContainer dir='auto'>
    <FullWidthLink to={path}>
      {!!thumbnail && <Thumbnail alt='' src={thumbnail} thumbnailSize={thumbnailSize} />}
      <Description>
        <TitleRow>
          <Title dir='auto'>{title}</Title>
          {Icon}
        </TitleRow>
        {children}
      </Description>
    </FullWidthLink>
  </ListItemContainer>
)

export default ListItem
