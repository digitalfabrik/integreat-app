import React from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'
import FontAwesome from 'react-fontawesome'

import { Link } from 'redux-little-router'

import styled from 'styled-components'

const Centered = styled.div`
  & > * {
    display: block;
    margin-top: 50px;
    text-align: center;
  }
`

/**
 * Our error component, but since the name Error collides with the ES6 class, we've called it Failure
 */
export class Failure extends React.Component {
  static propTypes = {
    error: PropTypes.string.isRequired,
    t: PropTypes.func.isRequired
  }

  render () {
    const {t, error} = this.props
    return <Centered>
      <div>{t(error)}</div>
      <div><FontAwesome name='frown-o' size='5x' /></div>
      <Link href={'/'}>{t('goToStart')}</Link>
    </Centered>
  }
}

export default translate('common')(Failure)
