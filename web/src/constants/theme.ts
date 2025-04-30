import { css, RuleSet } from 'styled-components'

export type HelpersType = {
  removeLinkHighlighting: RuleSet
  adaptiveFontSize: RuleSet
  adaptiveMediumFontSize: RuleSet
  adaptiveWidth: RuleSet
  adaptiveHeight: RuleSet
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
  adaptiveMediumFontSize: css`
    font-size: clamp(
      ${props => props.theme.fonts.adaptiveMediumFontSize.min},
      ${props => props.theme.fonts.adaptiveMediumFontSize.value},
      ${props => props.theme.fonts.adaptiveMediumFontSize.max}
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
