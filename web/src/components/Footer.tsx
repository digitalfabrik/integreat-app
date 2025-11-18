import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'

import buildConfig from '../constants/buildConfig'
import { useRouteParams } from '../hooks/useCityContentParams'
import useDimensions from '../hooks/useDimensions'
import useUpdateDimensions from '../hooks/useUpdateDimensions'
import getFooterLinks from '../utils/getFooterLinks'
import FooterListItem from './FooterListItem'
import List from './base/List'

const FooterContainer = styled('footer')`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: ${props => props.theme.spacing(2)};
  background-color: ${props => props.theme.palette.background.accent};
  padding: 8px;
`

const StyledList = styled(List)({
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'row',
})

const Footer = (): ReactElement | null => {
  const linkItems = getFooterLinks(useRouteParams())
  const { mobile } = useDimensions()
  useUpdateDimensions()

  if (mobile) {
    return null
  }

  return (
    <FooterContainer>
      <StyledList
        items={linkItems.map(item => (
          <FooterListItem key={item.to} to={item.to} text={item.text} />
        ))}
        disablePadding
      />
      {buildConfig().featureFlags.developerFriendly && (
        <Typography variant='body2'>
          {__VERSION_NAME__}+{__COMMIT_SHA__}
        </Typography>
      )}
    </FooterContainer>
  )
}

export default Footer
