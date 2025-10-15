import { styled } from '@mui/material/styles'

import { ExternalLinkIcon, PersonIcon, PersonLightIcon } from '../assets'

const RemoteContentSandBox = styled('div')<{ centered: boolean; smallText: boolean }>`
  font-family: ${props => props.theme.typography.fontFamily};
  font-size: ${props => props.theme.typography.fontSize}px;
  display: flow-root; /* clearfix for the img floats */

  ${props => (props.centered ? 'text-align: center;' : '')}
  ${props => (props.centered ? 'list-style-position: inside;' : '')}
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
    border: 1px solid ${props => props.theme.palette.background.accent};
  }

  a {
    overflow-wrap: break-word;
    color: ${props => props.theme.palette.primary.main};
  }

  details > * {
    padding: 0 8px;
  }

  details > img {
    padding: 0;
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
    width: 16px;
    height: 16px;
    color: ${props => props.theme.palette.primary.main};
    background-size: contain;
    background-repeat: no-repeat;
    vertical-align: middle;
    margin: 0 4px;
  }

  iframe {
    border: none;
    border-bottom: 1px solid ${props => props.theme.palette.divider};

    ${props => props.theme.breakpoints.down('md')} {
      max-width: 100%;
    }
  }

  .iframe-container {
    display: flex;
    padding: 4px;
    flex-direction: column;
    border: 1px solid ${props => props.theme.palette.divider};
    border-radius: 4px;
    box-shadow:
      0 1px 3px rgb(0 0 0 / 10%),
      0 1px 2px rgb(0 0 0 / 15%);
  }

  .iframe-info-text {
    display: flex;
    padding: 12px;
    justify-content: space-between;
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

  .contact-card {
    display: inline-block;
    box-sizing: border-box;
    padding: 16px;
    border-radius: 4px;
    background-repeat: no-repeat;
    background-color: ${props =>
      props.theme.isContrastTheme ? `${props.theme.palette.text.primary}10` : 'rgb(127 127 127 / 15%)'};
    background-image:
      linear-gradient(to right, ${props => props.theme.palette.background.default}F0 0 100%),
      url(${props => (props.theme.isContrastTheme ? PersonLightIcon : PersonIcon)});
    background-blend-mode: difference;
    background-position:
      calc(100% + 32px) 100%,
      calc(100% + 24px) calc(100% + 24px);
    background-size: 104px;
    box-shadow: 0 1px 1px rgb(0 0 0 / 40%);
    min-width: 72%;

    p {
      margin-top: 4px;
      margin-bottom: 0;
    }

    h4 {
      margin-bottom: 12px;
      margin-top: 0;
    }

    img {
      color: ${props => props.theme.palette.text.primary};
      margin-inline-end: 8px;
      filter: none;
    }

    ${props => props.theme.breakpoints.down('md')} {
      width: 100%;
    }
  }

  #opt-in-settings-link {
    margin-inline-start: 12px;
    padding: 0;
    cursor: pointer;
    align-self: center;
  }
`

export default RemoteContentSandBox
