import styled from 'styled-components'
import withPlatform from '../../platform/hocs/withPlatform'

export const RichLayout = styled.div`
  position: relative;
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  justify-content: space-between;
  font-family: ${props => props.theme.fonts.decorativeFontFamily};
  font-size-adjust: ${props => props.theme.fonts.fontSizeAdjust};
  line-height: ${props => props.theme.fonts.decorativeLineHeight};
`

export const Body = styled.div`
  width: 100%;
  max-width: ${props => props.theme.dimensions.maxWidth}px;
  flex-grow: 1;
  margin: 0 auto;
  background-color: ${props => props.theme.colors.backgroundColor};
  word-wrap: break-word;

  /* https://aykevl.nl/2014/09/fix-jumping-scrollbar */
  @media ${props => props.theme.dimensions.minMaxWidth} {
    padding-right: calc((200% - 100vw - var(--max-width)) / 2);
    padding-left: calc((100vw - var(--max-width)) / 2);
  }

  @media ${props => props.theme.dimensions.smallViewport} {
    display: flex;
    flex-direction: column-reverse;
  }
`

export const Main = styled.main`
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

export const Aside = withPlatform(styled.aside`
  position: ${props => (props.platform.positionStickyDisabled ? 'static' : 'sticky')};
  z-index: 2;
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
