import { css } from 'styled-components/native'

export const elevatedStyle = css`
  shadow-color: ${props => props.theme.colors.onSurface};
  shadow-offset: 0 2px;
  shadow-opacity: 0.2;
  shadow-radius: 3px;
  elevation: 5;
`
