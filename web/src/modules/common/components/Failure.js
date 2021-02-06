// @flow

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { withTranslation, TFunction } from 'react-i18next'
import Link from 'redux-first-router-link'
import styled from 'styled-components'
import { faFrown } from '../../../modules/app/constants/icons'
import I18nRedirectRouteConfig from '../../app/route-configs/I18nRedirectRouteConfig'



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
  t: typeof TFunction
|}

/**
 * Our error component, but since the name Error collides with the ES6 class, we've called it Failure
 */
export class Failure extends React.PureComponent<PropsType> {
  static defaultProps = {
    goToMessage: 'goTo.start',
    goToPath: new I18nRedirectRouteConfig().getRoutePath({})
  }

  render () {
    const { t, errorMessage, goToPath, goToMessage } = this.props

    return <Centered>
      <div>{t(errorMessage)}</div>
      <div><FontAwesomeIcon icon={faFrown} size='5x' /></div>
      <Link to={goToPath}>{t(goToMessage)}</Link>
    </Centered>
  }
}

export default withTranslation('error')(Failure)
