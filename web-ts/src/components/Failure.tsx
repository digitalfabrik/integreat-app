import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { withTranslation, TFunction } from 'react-i18next'
import styled from 'styled-components'
import { faFrown } from '../constants/icons'

const Centered = styled.div`
  & > * {
    display: block;
    margin-top: 50px;
    text-align: center;
  }
`

type PropsType = {
  errorMessage: string
  goToPath?: string
  goToMessage?: string
  t: TFunction
}

/**
 * Our error component, but since the name Error collides with the ES6 class, we've called it Failure
 */
export class Failure extends React.PureComponent<PropsType> {
  static defaultProps = {
    goToMessage: 'goTo.start',
    // goToPath: new I18nRedirectRouteConfig().getRoutePath({})
    // TODO use right default redirect path
    goToPath: '/'
  }

  render() {
    const { t, errorMessage, goToPath, goToMessage } = this.props

    return (
      <Centered>
        <div>{t(errorMessage)}</div>
        <div>
          <FontAwesomeIcon icon={faFrown} size='5x' />
        </div>
        {/* TODO Use right react-navigation link */}
        {/* {goToPath && <Link to={goToPath}>{goToMessage ? t(goToMessage) : goToPath}</Link>} */}
        {goToPath && <a href={goToPath}>{goToMessage ? t(goToMessage) : goToPath}</a>}
      </Centered>
    )
  }
}

export default withTranslation('error')(Failure)
