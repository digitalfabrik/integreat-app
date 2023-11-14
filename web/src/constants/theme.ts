import { DefaultTheme, FlattenInterpolation, FlattenSimpleInterpolation, ThemeProps, css } from 'styled-components'

export type HelpersType = {
  removeLinkHighlighting: FlattenSimpleInterpolation
  adaptiveFontSize: FlattenInterpolation<ThemeProps<DefaultTheme>>
}

export const helpers: HelpersType = {
  removeLinkHighlighting: css`
    color: inherit;
    text-decoration: none;
  `,
  adaptiveFontSize: css`
    font-size: clamp(
      ${props => props.theme.fonts.adaptiveFontSizeSmall.min},
      ${props => props.theme.fonts.adaptiveFontSizeSmall.value},
      ${props => props.theme.fonts.adaptiveFontSizeSmall.max}
    );
  `,
}
