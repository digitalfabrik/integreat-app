import { css } from '@emotion/react'
import { styled } from '@mui/material/styles'
import React, { ReactElement, ReactNode } from 'react'

import dimensions from '../constants/dimensions'
import { MobileBanner } from './MobileBanner'

export const RichLayout = styled('div')`
  position: relative;
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  justify-content: space-between;
  color: ${props => props.theme.legacy.colors.textColor};
  font-family: ${props => props.theme.legacy.fonts.web.decorativeFont};
  font-size-adjust: ${props => props.theme.legacy.fonts.fontSizeAdjust};
  background-color: ${props => props.theme.legacy.colors.backgroundColor};
  line-height: ${props => props.theme.legacy.fonts.decorativeLineHeight};

  & a,
  button {
    &:focus-visible {
      outline: 2px solid ${props => props.theme.legacy.colors.textSecondaryColor};
    }

    cursor: pointer;
  }
`

const Body = styled('div')<{ fullWidth: boolean; disableScrollingSafari: boolean }>`
  width: 100%;
  box-sizing: border-box;
  margin: 0 auto;
  flex-grow: 1;
  background-color: ${props => props.theme.legacy.colors.backgroundColor};
  word-wrap: break-word;
  min-height: 100%;
  display: flex;

  /* Fix jumping iOS Safari Toolbar by prevent scrolling on body */

  ${props =>
    props.disableScrollingSafari &&
    css`
      @supports (-webkit-touch-callout: none) {
        /* CSS specific to iOS safari devices */
        position: fixed;
        overflow: hidden;
      }
    `};
  /* https://aykevl.nl/2014/09/fix-jumping-scrollbar */
  ${props =>
    !props.fullWidth &&
    css`
      ${props.theme.breakpoints.up('lg')} {
        padding-inline: calc((100vw - ${props.theme.breakpoints.values.lg}px) / 2)
          calc((200% - 100vw - ${props.theme.breakpoints.values.lg}px) / 2);
      }
    `};
`

const Main = styled('main')<{ fullWidth: boolean }>`
  display: inline-block;
  width: ${props =>
    props.fullWidth ? '100%' : `${props.theme.breakpoints.values.lg - 2 * dimensions.toolbarWidth}px`};
  max-width: ${props => (props.fullWidth ? '100%' : `calc(100% - 2 * ${dimensions.toolbarWidth}px)`)};
  box-sizing: border-box;
  margin: 0 auto;
  padding: ${props => (props.fullWidth ? '0' : `0 ${dimensions.mainContainerHorizontalPadding}px 30px`)};
  text-align: start;
  word-wrap: break-word;

  ${props => props.theme.breakpoints.down('md')} {
    position: static;
    width: 100%;
    max-width: initial;
    margin-top: 0;
  }
`

const Aside = styled('aside')`
  position: fixed;
  top: 35%;
  width: 100px;
  left: 0;

  /* Position toolbar above content */
  z-index: 10;

  ${props => props.theme.breakpoints.up('lg')} {
    inset-inline-start: 8px;
  }
`

export const LAYOUT_ELEMENT_ID = 'layout'

type LayoutProps = {
  footer?: ReactNode
  header?: ReactNode
  toolbar?: ReactElement | null
  chat?: ReactNode
  children?: ReactNode
  fullWidth?: boolean
  disableScrollingSafari?: boolean
}

const Layout = ({
  footer,
  header,
  toolbar,
  chat,
  children,
  fullWidth = false,
  disableScrollingSafari = false,
}: LayoutProps): ReactElement => (
  <RichLayout id={LAYOUT_ELEMENT_ID}>
    <MobileBanner />
    {header}
    <Body fullWidth={fullWidth} disableScrollingSafari={disableScrollingSafari}>
      {toolbar && <Aside>{toolbar}</Aside>}
      <Main fullWidth={fullWidth}>{children}</Main>
    </Body>
    {chat}
    {footer}
  </RichLayout>
)

export default Layout
