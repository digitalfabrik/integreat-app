import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'

import getFooterLinks from '../utils/getFooterLinks'
import Footer from './Footer'
import FooterLink from './FooterLink'
import OverlayFooter from './OverlayFooter'
import List from './base/List'

const StyledList = styled(List)<{ horizontal: boolean }>`
  display: flex;
  justify-content: center;
  flex-direction: ${props => (props.horizontal ? 'row' : 'column')};
  width: ${props => (props.horizontal ? 'inherit' : '100%')};
  padding: ${props => (props.horizontal ? '0' : '0 32px')};
`

type CityContentFooterProps = {
  city: string
  language: string
  mode?: 'normal' | 'overlay' | 'sidebar'
}

const CityContentFooter = ({ city, language, mode = 'normal' }: CityContentFooterProps): ReactElement => {
  const linkItems = getFooterLinks({ city, language })
  const FooterContent = (
    <StyledList
      items={linkItems.map(item => (
        <FooterLink key={item.to} to={item.to} text={item.text} mode={mode} />
      ))}
      horizontal={mode !== 'sidebar'}
    />
  )

  return mode === 'overlay' ? <OverlayFooter>{FooterContent}</OverlayFooter> : <Footer>{FooterContent}</Footer>
}

export default CityContentFooter
