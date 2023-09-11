import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
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
}

const Failure = ({ errorMessage, goToPath, goToMessage = 'goTo.start' }: FailureProps): ReactElement => {
  const { t } = useTranslation('error')
  return (
    <Centered>
      <div>
        <StyledIcon src={SadSmileyIcon} />
      </div>
      <div role='alert'>{t(errorMessage)}</div>
      {!!goToPath && <Link to={goToPath}>{goToMessage ? t(goToMessage) : goToPath}</Link>}
    </Centered>
  )
}

export default Failure
