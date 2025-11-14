import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Skeleton from '@mui/material/Skeleton'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'

const StyledRight = styled(Box)`
  display: flex;
  justify-content: flex-end;
  gap: 6px;
  width: 100%;
`

const StyledLeft = styled(Box)`
  display: flex;
  justify-content: flex-start;
  gap: 6px;
  width: 100%;
`

const SkeletonChatConversation = (): ReactElement => (
  <>
    <StyledRight>
      <Skeleton variant='text' width='90%' />
      <Skeleton variant='circular'>
        <Avatar />
      </Skeleton>
    </StyledRight>
    <StyledLeft>
      <Skeleton variant='circular'>
        <Avatar />
      </Skeleton>
      <Skeleton variant='text' width='70%' />
    </StyledLeft>
  </>
)

export default SkeletonChatConversation
