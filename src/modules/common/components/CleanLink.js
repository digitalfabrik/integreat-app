// @flow

import { withProps } from 'recompose'
import Link from 'redux-first-router-link'

export default withProps({
  style: {
    'color': 'inherit',
    'textDecoration': 'none'
  }
})(Link)
