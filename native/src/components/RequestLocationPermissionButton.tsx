import LocationIcon from '../assets/IconPlaceholder.svg'
import SimpleImage from './SimpleImage'
import styled from 'styled-components/native'
import { TouchableOpacity, View } from 'react-native'
import { checkLocationPermission, requestLocationPermission } from '../utils/LocationPermissionManager'
import React, { ReactElement, useCallback, useEffect } from 'react'
import { RESULTS } from 'react-native-permissions'

const ICON_SIZE = 45

const Circle = styled(View)`
  position: absolute;
  right: 3%;
  bottom: 3%;
  margin-top: 9px;
  margin-bottom: 5px;
  border-radius: ${ICON_SIZE}px;
  height: ${ICON_SIZE}px;
  width: ${ICON_SIZE}px;
  background-color: ${props => props.theme.colors.backgroundColor};
  align-items: center;
  justify-content: center;
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.2;
  shadow-radius: 1.41px;
`

const ThumbnailContainer = styled(SimpleImage)`
  height: ${ICON_SIZE / Math.sqrt(2)}px;
  width: ${ICON_SIZE / Math.sqrt(2)}px;
`

type RequestLocationPermissionButtonProps = {
  requestLocationPermissionCallback: (locationPermissionGranted: boolean) => void
}

const RequestLocationPermissionButton = ({
  requestLocationPermissionCallback
}: RequestLocationPermissionButtonProps): ReactElement => {
  useEffect(() => {
    checkLocationPermission().then(locationPermissionStatus =>
      requestLocationPermissionCallback(locationPermissionStatus === RESULTS.GRANTED)
    )
  }, [requestLocationPermissionCallback])

  const requestPermission = useCallback(() => {
    requestLocationPermission().then(locationPermissionStatus =>
      requestLocationPermissionCallback(locationPermissionStatus === RESULTS.GRANTED)
    )
  }, [requestLocationPermissionCallback])

  return (
    <Circle>
      <TouchableOpacity onPress={requestPermission}>
        <ThumbnailContainer source={LocationIcon} />
      </TouchableOpacity>
    </Circle>
  )
}

export default RequestLocationPermissionButton
