import React, { ReactNode } from 'react'
import styled, { css } from 'styled-components'

import dimensions from '../constants/dimensions'
import useWindowDimensions from '../hooks/useWindowDimensions'
import '../styles/Aside.css'
import { MobileBanner } from './MobileBanner'
import Portal from './Portal'

export const RichLayout = styled.div`
  position: relative;
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  justify-content: space-between;
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.web.decorativeFont};
  font-size-adjust: ${props => props.theme.fonts.fontSizeAdjust};
  background-color: ${props => props.theme.colors.backgroundColor};
  line-height: ${props => props.theme.fonts.decorativeLineHeight};

  & a,
  button {
    &:focus-visible {
      outline: 2px solid ${props => props.theme.colors.textSecondaryColor};
    }

    cursor: pointer;
  }

  input {
    &:focus-visible {
      outline: 2px solid ${props => props.theme.colors.textSecondaryColor};
    }
  }

  textarea {
    &:focus-visible {
      outline: 2px solid ${props => props.theme.colors.textSecondaryColor};
    }
  }
`

const Body = styled.div<{ $fullWidth: boolean; $disableScrollingSafari: boolean }>`
  width: 100%;
  box-sizing: border-box;
  margin: 0 auto;
  flex-grow: 1;
  background-color: ${props => props.theme.colors.backgroundColor};
  word-wrap: break-word;
  min-height: 100%;
  display: flex;

  /* Fix jumping iOS Safari Toolbar by prevent scrolling on body */

  ${props =>
    props.$disableScrollingSafari &&
    css`
      @supports (-webkit-touch-callout: none) {
        /* CSS specific to iOS safari devices */
        position: fixed;
        overflow: hidden;
      }
    `};
  /* https://aykevl.nl/2014/09/fix-jumping-scrollbar */
  ${props =>
    !props.$fullWidth &&
    css`
      @media screen and ${dimensions.minMaxWidth} {
        padding-inline: calc((100vw - ${dimensions.maxWidth}px) / 2) calc((200% - 100vw - ${dimensions.maxWidth}px) / 2);
      }
    `};
`

const Main = styled.main<{ $fullWidth: boolean }>`
  display: inline-block;
  width: ${props => (props.$fullWidth ? '100%' : dimensions.maxWidth - 2 * dimensions.toolbarWidth)}px;
  max-width: calc(100% - ${dimensions.toolbarWidth}px);
  box-sizing: border-box;
  margin: 0 auto;
  padding: ${props => (props.$fullWidth ? '0' : `0 ${dimensions.mainContainerHorizontalPadding}px 30px`)};
  text-align: start;
  word-wrap: break-word;

  & p {
    margin: ${props => props.theme.fonts.standardParagraphMargin} 0;
  }

  @media screen and ${dimensions.smallViewport} {
    position: static;
    width: 100%;
    max-width: initial;
    margin-top: 0;
  }
`

export const LAYOUT_ELEMENT_ID = 'layout'

type LayoutProps = {
  footer?: ReactNode
  header?: ReactNode
  toolbar?: ReactNode
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
}: LayoutProps): JSX.Element => {
  const { viewportSmall } = useWindowDimensions()

  return (
    <RichLayout id={LAYOUT_ELEMENT_ID}>
      <MobileBanner />
      {header}
      <Body $fullWidth={fullWidth} $disableScrollingSafari={disableScrollingSafari}>
        {!viewportSmall && (
          <Portal className='aside' show>
            {toolbar}
          </Portal>
        )}
        <Main $fullWidth={fullWidth}>{children}</Main>
      </Body>
      {viewportSmall && toolbar}
      {chat}
      {footer}
    </RichLayout>
  )
}

export default Layout
