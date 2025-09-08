import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'

import useFooterLinks from '../hooks/useFooterLinks'
import useWindowDimensions from '../hooks/useWindowDimensions'
import { linkListItems } from './CityContentFooter'
import Footer from './Footer'
import List from './base/List'

const SidebarFooterContainer = styled('div')`
  width: 100%;
  margin-top: -10px; /* to counteract the padding-top of the normal footer */
  padding: 0 27px;
`

const StyledList = styled(List)`
  padding: 0;
`

type GeneralFooterProps = {
  language: string
}

const GeneralFooter = ({ language }: GeneralFooterProps): ReactElement => {
  const linkItems = useFooterLinks({ language })
  const { viewportSmall } = useWindowDimensions()

  return (
    <Footer>
      {viewportSmall ? (
        <SidebarFooterContainer>
          <StyledList NoItemsMessage='' items={linkListItems(linkItems)} horizontal={false} />
        </SidebarFooterContainer>
      ) : (
        <StyledList NoItemsMessage='' items={linkListItems(linkItems)} horizontal />
      )}
    </Footer>
  )
}

export default GeneralFooter
