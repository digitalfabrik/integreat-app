import styled, { css } from 'styled-components'

export const SandBox = styled.div`
  font-family: ${props => props.theme.fonts.contentFontFamily};
  font-size: ${props => props.theme.fonts.contentFontSize};
  line-height: ${props => props.theme.fonts.contentLineHeight};
  ${props => props.centered && css`
    text-align: center;
    list-style-position: inside;
  `}
  
  & img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
  
  & table {
    display: block;
    width: 100% !important;
    height: auto !important; /* need important because of bad-formatted remote-content */
    overflow: auto;
  }
  
  & tbody,
  & thead {
    display: table; /* little bit hacky, but works in all browsers, even IE11 :O */
    width: 100%;
    box-sizing: border-box;
    border-collapse: collapse;
  }

  & tbody,
  & thead,
  & th,
  & td {
    border: 1px solid ${props => props.theme.colors.backgroundAccentColor};
  }
  
  & a {
    overflow-wrap: break-word;
  }
`
