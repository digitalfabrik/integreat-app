// @flow

import React from 'react'
import type { TFunction } from 'react-i18next'
import { translate } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFrown } from '../../../modules/app/constants/icons'

import Link from 'redux-first-router-link'

import styled from 'styled-components'
import i18nRedirectRoute from '../../app/routes/i18nRedirect'

const Centered = styled.div`
  & > * {
    display: block;
    margin-top: 50px;
    text-align: center;
  }
`

type PropsType = {|
  errorMessage: string,
  goToPath?: string,
  goToMessage?: string,
  t: TFunction
|}

/**
 * Our error component, but since the name Error collides with the ES6 class, we've called it Failure
 */
export class Failure extends React.Component<PropsType> {
  render () {
    const {t, errorMessage, goToPath, goToMessage} = this.props
    return <Centered>
      <div>{t(errorMessage)}</div>
      <div><FontAwesomeIcon icon={faFrown} size='5x' /></div>
      <Link to={goToPath || i18nRedirectRoute.getRoutePath({})}>{t(goToMessage || 'goTo.start')}</Link>
    </Centered>
  }
}

export default translate('error')(Failure)
