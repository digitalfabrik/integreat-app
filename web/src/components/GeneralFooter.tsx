import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'

import getFooterLinks from '../utils/getFooterLinks'
import Footer from './Footer'
import FooterLink from './FooterLink'
import List from './base/List'

const StyledList = styled(List)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'row',

  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    width: '100%',
    padding: '0 32px',
  },
}))

type GeneralFooterProps = {
  language: string
}

const GeneralFooter = ({ language }: GeneralFooterProps): ReactElement => {
  const linkItems = getFooterLinks({ languageCode: language })

  return (
    <Footer>
      <StyledList
        items={linkItems.map(item => (
          <FooterLink key={item.to} to={item.to} text={item.text} />
        ))}
      />
    </Footer>
  )
}

export default GeneralFooter
