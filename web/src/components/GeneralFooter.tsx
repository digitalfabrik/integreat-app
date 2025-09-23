import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'

import useWindowDimensions from '../hooks/useWindowDimensions'
import getFooterLinks from '../utils/getFooterLinks'
import Footer from './Footer'
import FooterLink from './FooterLink'
import List from './base/List'

const StyledList = styled(List)<{ horizontal: boolean }>`
  display: flex;
  justify-content: center;
  flex-direction: ${props => (props.horizontal ? 'row' : 'column')};
  width: ${props => (props.horizontal ? 'inherit' : '100%')};
  padding: ${props => (props.horizontal ? '0' : '0 32px')};
`

type GeneralFooterProps = {
  language: string
}

const GeneralFooter = ({ language }: GeneralFooterProps): ReactElement => {
  const linkItems = getFooterLinks({ language })
  const { viewportSmall } = useWindowDimensions()

  return (
    <Footer>
      <StyledList
        Items={linkItems.map(item => (
          <FooterLink key={item.to} to={item.to} text={item.text} />
        ))}
        horizontal={!viewportSmall}
      />
    </Footer>
  )
}

export default GeneralFooter
