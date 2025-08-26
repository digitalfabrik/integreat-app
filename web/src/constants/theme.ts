import { css, SerializedStyles } from '@emotion/react'
import { Theme } from '@mui/material/styles'

export type HelpersType = {
  removeLinkHighlighting: SerializedStyles
  adaptiveFontSize: (props: { theme: Theme }) => SerializedStyles
  adaptiveWidth: (props: { theme: Theme }) => SerializedStyles
  adaptiveHeight: (props: { theme: Theme }) => SerializedStyles
  adaptiveThemeTextColor: (props: { theme: Theme }) => SerializedStyles
}

export const helpers: HelpersType = {
  removeLinkHighlighting: css`
    color: inherit;
    text-decoration: none;
  `,
  adaptiveFontSize: ({ theme }): SerializedStyles => css`
    font-size: clamp(
      ${theme.legacy.fonts.adaptiveFontSizeSmall.min},
      ${theme.legacy.fonts.adaptiveFontSizeSmall.value},
      ${theme.legacy.fonts.adaptiveFontSizeSmall.max}
    );
  `,
  adaptiveWidth: ({ theme }): SerializedStyles => css`
    width: clamp(
      ${theme.legacy.fonts.adaptiveFontSizeSmall.min},
      ${theme.legacy.fonts.adaptiveFontSizeSmall.value},
      ${theme.legacy.fonts.adaptiveFontSizeSmall.max}
    );
  `,
  adaptiveHeight: ({ theme }): SerializedStyles => css`
    height: clamp(
      ${theme.legacy.fonts.adaptiveFontSizeSmall.min},
      ${theme.legacy.fonts.adaptiveFontSizeSmall.value},
      ${theme.legacy.fonts.adaptiveFontSizeSmall.max}
    );
  `,
  adaptiveThemeTextColor: ({ theme }): SerializedStyles => css`
    color: ${theme.isContrastTheme ? theme.legacy.colors.backgroundColor : theme.legacy.colors.textColor};
  `,
}
