import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  body {
    position: relative;

    /* react-tooltip: https://react-tooltip.com/docs/getting-started#styling */
    --rt-color-dark: ${props => props.theme.colors.textSecondaryColor};
    --rt-color-white: ${props => props.theme.colors.backgroundColor};
    --rt-opacity: 1;

    /* stylelint-disable selector-class-pattern */
   
    /* react-datepicker */
    .react-datepicker__header {
      background-color: ${props => props.theme.colors.backgroundAccentColor};
    }

    .react-datepicker__month,
    .react-datepicker__month-container,
    .react-datepicker__day {
      background-color: ${props => props.theme.colors.backgroundColor};
    }

    .react-datepicker__current-month,
    .react-datepicker__day-names,
    .react-datepicker__day-name,
    .react-datepicker__week,
    .react-datepicker__day {
      color: ${props => props.theme.colors.textColor};
    }

    .react-datepicker__day--today {
      border: 1px solid ${props => props.theme.colors.linkColor};
      background-color: transparent !important;
      border-radius: 50% !important;
    }

    .react-datepicker__day--selected {
      background-color: ${props => props.theme.colors.linkColor} !important;
    }

    .react-datepicker__day--selected:not([aria-disabled='true']):hover,
    .react-datepicker__day--in-selecting-range:not([aria-disabled='true']):hover,
    .react-datepicker__day--in-range:not([aria-disabled='true']):hover,
    .react-datepicker__day:not([aria-disabled='true']):hover {
      background-color: ${props => props.theme.colors.linkColor} !important;
    }

    /* stylelint-enable selector-class-pattern */

    /* react-spring-bottom-sheet */
    [data-rsbs-header] {
      background-color: ${props => props.theme.colors.backgroundAccentColor};
      box-shadow: none;
      padding-top: calc(24px + env(safe-area-inset-top));
    }

    [data-rsbs-header]::before {
      background-color: ${props => props.theme.colors.textColor};
      width: 28px;
      height: 3px;
      top: calc(18px + env(safe-area-inset-top));
    }

    [data-rsbs-has-header='false'] [data-rsbs-header] {
      padding-top: calc(32px + env(safe-area-inset-top));
    }

    [data-rsbs-content] {
      min-height: 100%;
      display: flex;
    }

    [data-rsbs-overlay] {
      min-height: 40px;
    }

    [data-rsbs-scroll='true'] {
      background-color: ${props => props.theme.colors.backgroundColor};
    }
  }
`
export default GlobalStyle
