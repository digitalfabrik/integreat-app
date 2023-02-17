import React, { ReactNode, useEffect, useState } from 'react'
import styled, { css } from 'styled-components'

import dimensions from '../constants/dimensions'
import useWindowDimensions from '../hooks/useWindowDimensions'

// Needed for sticky footer on IE - see https://stackoverflow.com/a/31835167
const FlexWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const RichLayout = styled.div`
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
    outline: none;
    cursor: pointer;
  }
`

const Body = styled.div<{ fullWidth: boolean; disableScrollingSafari: boolean }>`
  width: 100%;
  box-sizing: border-box;
  flex-grow: 1;
  margin: 0 auto;
  background-color: ${props => props.theme.colors.backgroundColor};
  word-wrap: break-word;
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
      @media ${dimensions.minMaxWidth} {
        padding-right: calc((200% - 100vw - ${dimensions.maxWidth}px) / 2);
        padding-left: calc((100vw - ${dimensions.maxWidth}px) / 2);
      }
    `};

  @media ${dimensions.smallViewport} {
    display: flex;
    flex-direction: column-reverse;
  }
`

const Main = styled.main<{ fullWidth: boolean }>`
  display: inline-block;
  width: ${props => (props.fullWidth ? '100%' : dimensions.maxWidth - 2 * dimensions.toolbarWidth)}px;
  max-width: calc(100% - ${dimensions.toolbarWidth}px);
  box-sizing: border-box;
  margin: 0 auto;
  padding: 0 10px 30px;
  padding: ${props => (props.fullWidth ? '0' : '0 10px 30px')};
  text-align: start;
  word-wrap: break-word;

  & p {
    margin: ${props => props.theme.fonts.standardParagraphMargin} 0;
  }

  @media ${dimensions.smallViewport} {
    position: static;
    width: 100%;
    max-width: initial;
    margin-top: 0;
  }
`

const Aside = styled.aside<{ languageSelectorHeight: number }>`
  top: ${props => props.languageSelectorHeight + dimensions.headerHeightLarge}px;
  display: inline-block;
  position: sticky;
  padding-top: 32px;
  width: ${dimensions.toolbarWidth}px;
  vertical-align: top;
  transition: top 0.2s ease-in-out;
  z-index: 10;

  &:empty {
    display: none;
  }

  &:empty + * {
    display: block;
    max-width: 100%;
  }

  @media ${dimensions.smallViewport} {
    position: static;
    width: 100%;
    max-width: initial;
    margin-top: 0;
  }
`

type LayoutProps = {
  footer?: ReactNode
  header?: ReactNode
  toolbar?: ReactNode
  modal?: ReactNode
  children?: ReactNode
  fullWidth?: boolean
  disableScrollingSafari?: boolean
}

/**
 * The standard Layout, used for any view in this app as a container.
 * If a footer is supplied and there's not enough content (in header and children) to fill the viewbox, the footer will
 * always stick to the bottom of the viewbox.
 */
const Layout = ({
  footer,
  header,
  toolbar,
  modal,
  children,
  fullWidth = false,
  disableScrollingSafari = false,
}: LayoutProps): JSX.Element => {
  const modalVisible = !!modal
  const { width } = useWindowDimensions()
  const [languageSelectorHeight, setLanguageSelectorHeight] = useState<number>(0)

  useEffect(() => {
    const panelHeight = document.getElementById('languageSelector')?.clientHeight
    setLanguageSelectorHeight(panelHeight ?? 0)
  }, [width])

  return (
    <FlexWrapper>
      <RichLayout>
        <div aria-hidden={modalVisible}>
          {header}
          <Body fullWidth={fullWidth} disableScrollingSafari={disableScrollingSafari}>
            <Aside languageSelectorHeight={languageSelectorHeight}>{toolbar}</Aside>
            <Main fullWidth={fullWidth}>{children}</Main>
          </Body>
        </div>
        {modal}
        <div aria-hidden={modalVisible}>{footer}</div>
      </RichLayout>
    </FlexWrapper>
  )
}

export default Layout
