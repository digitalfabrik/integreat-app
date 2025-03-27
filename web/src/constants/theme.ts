import { css } from 'styled-components'

export type HelpersType = {
  removeLinkHighlighting: ReturnType<typeof css>
  adaptiveFontSize: ReturnType<typeof css>
  adaptiveWidth: ReturnType<typeof css>
  adaptiveHeight: ReturnType<typeof css>
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
  adaptiveWidth: css`
    width: clamp(
      ${props => props.theme.fonts.adaptiveFontSizeSmall.min},
      ${props => props.theme.fonts.adaptiveFontSizeSmall.value},
      ${props => props.theme.fonts.adaptiveFontSizeSmall.max}
    );
  `,
  adaptiveHeight: css`
    height: clamp(
      ${props => props.theme.fonts.adaptiveFontSizeSmall.min},
      ${props => props.theme.fonts.adaptiveFontSizeSmall.value},
      ${props => props.theme.fonts.adaptiveFontSizeSmall.max}
    );
  `,
}
