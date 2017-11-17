import React from 'react'

// this mock makes sure any components using the translate HoC receive the t function as a prop
export const translate = (key) => Component => props => <Component t={() => key} {...props} />
