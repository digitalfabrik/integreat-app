import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { withTranslation, TFunction } from 'react-i18next'
import styled from 'styled-components'
import { faFrown } from '../constants/icons'
import { Link } from 'react-router-dom'

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
        {goToPath && <Link to={goToPath}>{goToMessage ? t(goToMessage) : goToPath}</Link>}
      </Centered>
    )
  }
}

export default withTranslation('error')(Failure)
