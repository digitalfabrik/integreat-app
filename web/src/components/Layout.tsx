import React, { ReactNode, useLayoutEffect, useState } from 'react'
import styled, { css } from 'styled-components'

import dimensions from '../constants/dimensions'
import useWindowDimensions from '../hooks/useWindowDimensions'

const additionalToolbarTopSpacing = 32

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

const Body = styled.div<{ fullWidth: boolean; disableScrollingSafari: boolean }>`
  width: 100%;
  box-sizing: border-box;
  margin: 0 auto;
  flex-grow: 1;
  background-color: ${props => props.theme.colors.backgroundColor};
  word-wrap: break-word;
  min-height: 100%;

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
      @media screen and ${dimensions.minMaxWidth} {
        padding-inline: calc((100vw - ${dimensions.maxWidth}px) / 2) calc((200% - 100vw - ${dimensions.maxWidth}px) / 2);
      }
    `};
`

const Main = styled.main<{ fullWidth: boolean }>`
  display: inline-block;
  width: ${props => (props.fullWidth ? '100%' : dimensions.maxWidth - 2 * dimensions.toolbarWidth)}px;
  max-width: calc(100% - ${dimensions.toolbarWidth}px);
  box-sizing: border-box;
  margin: 0 auto;
  padding: ${props => (props.fullWidth ? '0' : `0 ${dimensions.mainContainerHorizontalPadding}px 30px`)};
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

const Aside = styled.aside<{ languageSelectorHeight: number }>`
  top: ${props => props.languageSelectorHeight + dimensions.headerHeightLarge + additionalToolbarTopSpacing}px;
  margin-top: ${props => props.languageSelectorHeight - dimensions.navigationMenuHeight}px;
  display: inline-block;
  position: sticky;
  width: ${dimensions.toolbarWidth}px;
  vertical-align: top;
  z-index: 10;

  &:empty {
    display: none;
  }

  &:empty + * {
    display: block;
    max-width: 100%;
  }
`

export const LAYOUT_ELEMENT_ID = 'layout'

type LayoutProps = {
  footer?: ReactNode
  header?: ReactNode
  toolbar?: ReactNode
  children?: ReactNode
  fullWidth?: boolean
  disableScrollingSafari?: boolean
}

const Layout = ({
  footer,
  header,
  toolbar,
  children,
  fullWidth = false,
  disableScrollingSafari = false,
}: LayoutProps): JSX.Element => {
  const { width, viewportSmall } = useWindowDimensions()
  const [languageSelectorHeight, setLanguageSelectorHeight] = useState<number>(0)

  useLayoutEffect(() => {
    const panelHeight = document.getElementById('languageSelector')?.clientHeight
    setLanguageSelectorHeight(panelHeight ?? 0)
  }, [width])

  return (
    <RichLayout id={LAYOUT_ELEMENT_ID}>
      {header}
      <Body fullWidth={fullWidth} disableScrollingSafari={disableScrollingSafari}>
        {!viewportSmall && <Aside languageSelectorHeight={languageSelectorHeight}>{toolbar}</Aside>}
        <Main fullWidth={fullWidth}>{children}</Main>
      </Body>
      {viewportSmall && toolbar}
      {footer}
    </RichLayout>
  )
}

export default Layout
