import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { ReactElement } from 'react'
import { TFunction } from 'react-i18next'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { faFrown } from '../constants/icons'

const Centered = styled.div`
  & > * {
    display: block;
    margin-top: 50px;
    text-align: center;
  }
`

type FailurePropsType = {
  errorMessage: string
  goToPath?: string
  goToMessage?: string
  t: TFunction<'error'>
}

const Failure = ({ errorMessage, goToPath, goToMessage = 'goTo.start', t }: FailurePropsType): ReactElement => (
  <Centered>
    <div>
      <FontAwesomeIcon icon={faFrown} size='4x' />
    </div>
    <div role='alert'>{t(errorMessage)}</div>
    {goToPath && <Link to={goToPath}>{goToMessage ? t(goToMessage) : goToPath}</Link>}
  </Centered>
)

export default Failure
