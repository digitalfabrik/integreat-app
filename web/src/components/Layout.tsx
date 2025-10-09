import { css } from '@emotion/react'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import React, { ReactElement, ReactNode } from 'react'

import useDimensions from '../hooks/useDimensions'
import MobileBanner from './MobileBanner'

export const LAYOUT_ELEMENT_ID = 'layout'

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

const Body = styled('div')<{ fitScreen: boolean }>`
  width: 100%;
  box-sizing: border-box;
  margin: 0 auto;
  flex-grow: 1;
  background-color: ${props => props.theme.legacy.colors.backgroundColor};
  word-wrap: break-word;
  min-height: 100%;
  display: flex;

  ${props =>
    props.fitScreen
      ? /* Fix jumping iOS Safari Toolbar by prevent scrolling on body */
        css`
          @supports (-webkit-touch-callout: none) {
            /* CSS specific to iOS safari devices */
            position: fixed;
            overflow: hidden;
          }
        `
      : /* https://aykevl.nl/2014/09/fix-jumping-scrollbar */
        css`
          ${props.theme.breakpoints.up('lg')} {
            padding-inline: calc((100vw - ${props.theme.breakpoints.values.lg}px) / 2)
              calc((200% - 100vw - ${props.theme.breakpoints.values.lg}px) / 2);
          }
        `};
`

const Main = styled('main')<{ fitScreen: boolean }>`
  display: inline-block;
  width: ${props => (props.fitScreen ? '100%' : `calc(${props.theme.breakpoints.values.lg}px - 240px)`)};
  max-width: ${props => (props.fitScreen ? '100%' : `calc(100% - 240px)`)};
  box-sizing: border-box;
  margin: 0 auto;
  padding: ${props => (props.fitScreen ? '0' : `0 16px 32px`)};
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

  ${props => props.theme.breakpoints.up('lg')} {
    inset-inline-start: 8px;
  }
`

const Spacer = styled(Stack)`
  transition: height 250ms ease-in;
`

type LayoutProps = {
  footer?: ReactNode
  header?: ReactNode
  toolbar?: ReactElement | null
  children?: ReactNode
  fitScreen?: boolean
}

const Layout = ({ footer, header, toolbar, children, fitScreen = false }: LayoutProps): ReactElement => {
  const { ttsPlayerHeight, bottomNavigationHeight } = useDimensions()
  const extraChatButtonPadding = 16
  const extraBottomSpace = ttsPlayerHeight + (bottomNavigationHeight ?? 0) + extraChatButtonPadding

  return (
    <RichLayout id={LAYOUT_ELEMENT_ID}>
      {!fitScreen && <MobileBanner />}
      {header}
      <Body fitScreen={fitScreen}>
        {toolbar && <Aside>{toolbar}</Aside>}
        <Main fitScreen={fitScreen}>
          {children}
          {!fitScreen && <Spacer height={extraBottomSpace} />}
        </Main>
      </Body>
      {footer}
    </RichLayout>
  )
}

export default Layout
