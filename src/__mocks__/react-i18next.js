// @flow

import * as React from 'react'

export const translate = () => Component => props => <Component {...props} t={key => key} />
