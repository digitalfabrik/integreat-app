import React, { ReactElement } from 'react'
import { TFunction } from 'react-i18next'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

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
  t: TFunction<'error'>
}

const Failure = ({ errorMessage, goToPath = '/', goToMessage = 'goTo.start', t }: PropsType): ReactElement => (
  <Centered>
    <div>{t(errorMessage)}</div>
    <div>
      <FontAwesomeIcon icon={faFrown} size='5x' />
    </div>
    {goToPath && <Link to={goToPath}>{goToMessage ? t(goToMessage) : goToPath}</Link>}
  </Centered>
)

export default Failure
