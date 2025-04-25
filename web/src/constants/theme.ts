import { css, RuleSet } from 'styled-components'

export type HelpersType = {
  removeLinkHighlighting: RuleSet
  adaptiveFontSize: RuleSet
  adaptiveWidth: RuleSet
  adaptiveHeight: RuleSet
  adaptiveThemeTextColor: RuleSet
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
  adaptiveThemeTextColor: css`
    color: ${props =>
      props.theme.isContrastTheme ? props.theme.colors.backgroundColor : props.theme.colors.textColor};
  `,
}
