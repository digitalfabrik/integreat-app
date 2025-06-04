import { css, SerializedStyles, Theme } from '@emotion/react'

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
      ${theme.fonts.adaptiveFontSizeSmall.min},
      ${theme.fonts.adaptiveFontSizeSmall.value},
      ${theme.fonts.adaptiveFontSizeSmall.max}
    );
  `,
  adaptiveWidth: ({ theme }): SerializedStyles => css`
    width: clamp(
      ${theme.fonts.adaptiveFontSizeSmall.min},
      ${theme.fonts.adaptiveFontSizeSmall.value},
      ${theme.fonts.adaptiveFontSizeSmall.max}
    );
  `,
  adaptiveHeight: ({ theme }): SerializedStyles => css`
    height: clamp(
      ${theme.fonts.adaptiveFontSizeSmall.min},
      ${theme.fonts.adaptiveFontSizeSmall.value},
      ${theme.fonts.adaptiveFontSizeSmall.max}
    );
  `,
  adaptiveThemeTextColor: ({ theme }): SerializedStyles => css`
    color: ${theme.isContrastTheme ? theme.colors.backgroundColor : theme.colors.textColor};
  `,
}
