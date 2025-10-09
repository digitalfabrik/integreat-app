import { keyframes } from '@emotion/react'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'

/** From https://github.com/ConnorAtherton/loaders.css/blob/master/loaders.css */
const lineScaleParty = keyframes`
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(0.5);
  }

  100% {
    transform: scale(1);
  }
`

const Spinner = styled('div')`
  margin-top: 50px;
  text-align: center;
  animation-name: ${lineScaleParty};

  > div {
    background-color: ${props => props.theme.palette.text.secondary};
    width: 4px;
    height: 35px;
    border-radius: 2px;
    margin: 2px;
    animation-fill-mode: both;
    display: inline-block;
    animation-name: ${lineScaleParty};
    animation-iteration-count: infinite;
  }

  > div:nth-of-type(1) {
    animation-delay: 0.48s;
    animation-duration: 0.54s;
  }

  > div:nth-of-type(2) {
    animation-delay: -0.15s;
    animation-duration: 1.15s;
  }

  > div:nth-of-type(3) {
    animation-delay: -0.04s;
    animation-duration: 0.77s;
  }

  > div:nth-of-type(4) {
    animation-delay: -0.12s;
    animation-duration: 0.61s;
  }
`

type LoadingSpinnerProps = {
  className?: string
}

const LoadingSpinner = ({ className }: LoadingSpinnerProps): ReactElement => (
  <Spinner className={className}>
    <div />
    <div />
    <div />
    <div />
  </Spinner>
)

export default LoadingSpinner
