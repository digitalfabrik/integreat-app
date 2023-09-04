import { TFunction } from 'i18next'
import React, { ReactElement } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { SadSmileyIcon } from '../assets'
import Icon from './base/Icon'

const Centered = styled.div`
  & > * {
    display: block;
    margin-top: 50px;
    text-align: center;
  }
`

const StyledIcon = styled(Icon)`
  width: 64px;
  height: 64px;
`

type FailureProps = {
  errorMessage: string
  goToPath?: string
  goToMessage?: string
  t: TFunction
}

const Failure = ({ errorMessage, goToPath, goToMessage = 'goTo.start', t }: FailureProps): ReactElement => (
  <Centered>
    <div>
      <StyledIcon src={SadSmileyIcon} />
    </div>
    <div role='alert'>{t(errorMessage)}</div>
    {!!goToPath && <Link to={goToPath}>{goToMessage ? t(goToMessage) : goToPath}</Link>}
  </Centered>
)

export default Failure
