import React from 'react'

// this mock makes sure any components using the translate HoC receive the t function as a prop
export const translate = (namespace) => Component => props => <Component t={key => `${namespace}:${key}`} {...props} />
