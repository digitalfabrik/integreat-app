import styled, { css } from 'styled-components'

import { ExternalLinkIcon } from '../assets'
import dimensions from '../constants/dimensions'
import { helpers } from '../constants/theme'

const RemoteContentSandBox = styled.div<{ $centered: boolean; $smallText: boolean }>`
  font-family: ${props => props.theme.fonts.web.contentFont};
  font-size: ${props => (props.$smallText ? helpers.adaptiveFontSize : props.theme.fonts.contentFontSize)};
  line-height: ${props => props.theme.fonts.contentLineHeight};
  display: flow-root; /* clearfix for the img floats */

  ${props => (props.$centered ? 'text-align: center;' : '')}
  ${props => (props.$centered ? 'list-style-position: inside;' : '')}
    img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;

    &.alignright {
      float: inline-end;
    }

    &.alignleft {
      float: inline-start;
    }

    &.aligncenter {
      display: block;
      margin: auto;
    }
  }

  figure {
    margin-inline-start: 0;
    text-align: center;
    margin: 15px auto;

    @media only screen and (width <= 640px) {
      width: 100% !important;
    }
  }

  figcaption {
    font-size: ${props => props.theme.fonts.hintFontSize};
    font-style: italic;
    padding: 0 15px;
  }

  table {
    display: block;
    width: 100% !important;
    height: auto !important; /* need important because of badly formatted remote content */
    overflow: auto;
  }

  tbody,
  thead {
    display: table; /* little bit hacky, but works in all browsers, even IE11 :O */
    width: 100%;
    box-sizing: border-box;
    border-collapse: collapse;
  }

  tbody,
  thead,
  th,
  td {
    border: 1px solid ${props => props.theme.colors.backgroundAccentColor};
  }

  a {
    overflow-wrap: break-word;
  }

  details > * {
    padding: 0 25px;
  }

  details > summary {
    padding: 0;
  }

  pre {
    overflow-x: auto;
  }

  .link-external::after {
    content: '';
    display: inline-block;
    background-image: url('${ExternalLinkIcon}');
    width: ${props => props.theme.fonts.contentFontSize};
    height: ${props => props.theme.fonts.contentFontSize};
    ${props =>
      props.$smallText &&
      css`
        ${helpers.adaptiveHeight}
        ${helpers.adaptiveWidth}
      `};
    background-size: contain;
    background-repeat: no-repeat;
    vertical-align: middle;
    margin: 0 4px;
  }

  iframe {
    border: none;
    border-bottom: 1px solid ${props => props.theme.colors.borderColor};

    @media ${dimensions.smallViewport} {
      max-width: 100%;
    }
  }

  .iframe-container {
    display: flex;
    padding: 4px;
    flex-direction: column;
    border: 1px solid ${props => props.theme.colors.borderColor};
    border-radius: 4px;
    box-shadow:
      0 1px 3px rgb(0 0 0 / 10%),
      0 1px 2px rgb(0 0 0 / 15%);
  }

  .iframe-info-text {
    display: flex;
    padding: 12px;
    justify-content: space-between;
    font-size: ${props => props.theme.fonts.decorativeFontSizeSmall};
  }

  .iframe-info-text > input {
    margin-inline-start: 12px;
    cursor: pointer;
  }

  .iframe-info-text > label {
    cursor: pointer;
  }

  .iframe-source {
    display: contents;
    font-weight: bold;
  }

  #opt-in-settings-link {
    margin-inline-start: 12px;
    padding: 0;
    cursor: pointer;
    align-self: center;
  }
`

export default RemoteContentSandBox
