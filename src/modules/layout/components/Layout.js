// @flow

import type { Node } from 'react'
import React from 'react'
import ReactTooltip from 'react-tooltip'
import styled from 'styled-components'
import withPlatform from '../../platform/hocs/withPlatform'

const RichLayout = styled.div`
  position: relative;
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  justify-content: space-between;
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.decorativeFontFamily};
  font-size-adjust: ${props => props.theme.fonts.fontSizeAdjust};
  background-color: ${props => props.theme.colors.backgroundColor};
  line-height: ${props => props.theme.fonts.decorativeLineHeight};
`

const Body = styled.div`
  width: 100%;
  box-sizing: border-box;
  flex-grow: 1;
  margin: 0 auto;
  background-color: ${props => props.theme.colors.backgroundColor};
  word-wrap: break-word;

  /* https://aykevl.nl/2014/09/fix-jumping-scrollbar */
  @media ${props => props.theme.dimensions.minMaxWidth} {
    padding-right: calc((200% - 100vw - ${props => props.theme.dimensions.maxWidth}px) / 2);
    padding-left: calc((100vw - ${props => props.theme.dimensions.maxWidth}px) / 2);
  }

  @media ${props => props.theme.dimensions.smallViewport} {
    display: flex;
    flex-direction: column-reverse;
  }
`

const Main = styled.main`
  display: inline-block;
  width: ${props => props.theme.dimensions.maxWidth - 2 * props.theme.dimensions.toolbarWidth}px;
  max-width: calc(100% - ${props => props.theme.dimensions.toolbarWidth}px);
  box-sizing: border-box;
  margin: 0 auto;
  padding: 0 10px;
  text-align: start;
  word-wrap: break-word;

  & p {
    margin: ${props => props.theme.fonts.standardParagraphMargin} 0;
  }

  @media ${props => props.theme.dimensions.smallViewport} {
    position: static;
    width: 100%;
    max-width: initial;
    margin-top: 0;
  }
`

const Aside = withPlatform(styled.aside`
  position: ${props => (props.platform.positionStickyDisabled ? 'static' : 'sticky')};
  display: inline-block;
  width: ${props => props.theme.dimensions.toolbarWidth}px;
  margin-top: 105px;
  vertical-align: top;
  transition: top 0.2s ease-in-out;

  &:empty {
    display: none;
  }

  &:empty + * {
    display: block;
    max-width: 100%;
  }

  @media ${props => props.theme.dimensions.smallViewport} {
    position: static;
    width: 100%;
    max-width: initial;
    margin-top: 0;
  }
`)

type PropsType = {|
  asideStickyTop: number,
  footer?: Node,
  header?: Node,
  toolbar?: Node,
  modal?: Node,
  children?: Node,
  darkMode?: boolean
|}

/**
 * The standard Layout, used for any view in this app as a container.
 * If a footer is supplied and there's not enough content (in header and children) to fill the viewbox, the footer will
 * always stick to the bottom of the viewbox.
 */
class Layout extends React.PureComponent<PropsType> {
  static defaultProps = {
    asideStickyTop: 0,
    darkMode: false
  }

  render () {
    const { asideStickyTop, footer, header, toolbar, modal, children, darkMode } = this.props
    const modalVisible = !!modal
    return (
      <RichLayout>
        <div aria-hidden={modalVisible}>
          {header}
          <Body>
            <Aside style={{ top: `${asideStickyTop}px` }}>
              {toolbar}
            </Aside>
            <Main>
              {children}
            </Main>
          </Body>
        </div>
        <ReactTooltip effect='solid' type={darkMode ? 'light' : 'dark'} delayShow={0} />
        {modal}
        <div aria-hidden={modalVisible}>
          {footer}
        </div>
      </RichLayout>
    )
  }
}

export default Layout
