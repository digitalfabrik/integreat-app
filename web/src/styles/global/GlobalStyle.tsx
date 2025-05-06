import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
    body {
        position: relative;

        /* Styling for react-tooltip: https://react-tooltip.com/docs/getting-started#styling */
            --rt-color-dark: ${props => props.theme.colors.textSecondaryColor};
        --rt-color-white: ${props => props.theme.colors.backgroundColor};
        --rt-opacity: 1;
        
        /* Styling for react-datepicker */
        ${props =>
          props.theme.isContrastTheme === true &&
          `
          .react-datepicker__header,
          .react-datepicker__month,
          .react-datepicker__day {
            background-color: ${props.theme.colors.backgroundColor};
          }
    
          .react-datepicker__current-month,
          .react-datepicker__day-names .react-datepicker__day-name,
          .react-datepicker__week,
          .react-datepicker__day {
            color: ${props.theme.colors.textColor};
          }
          
          .react-datepicker__day--today {
          border: 1px solid ${props.theme.colors.linkColor};
          background-color: transparent !important;
          border-radius: 50% !important;
          }
          
           .react-datepicker__day--selected:not([aria-disabled='true']):hover,
           .react-datepicker__day--in-selecting-range:not([aria-disabled='true']):hover,
           .react-datepicker__day--in-range:not([aria-disabled='true']):hover,
           .react-datepicker__day:not([aria-disabled=true]):hover {
             background-color: ${props.theme.colors.linkColor} !important;
          }
    
           .react-datepicker__day--selected {
             background-color: ${props.theme.colors.linkColor} !important;
          }
          
          /* Styling for BottomSheet header in poi */
          [data-rsbs-header]{
            background-color: ${props.theme.colors.backgroundAccentColor}; 
           }
            
          [data-rsbs-header]::before {
            background-color: ${props.theme.colors.textColor};
          }
        `}
        }
`
export default GlobalStyle
