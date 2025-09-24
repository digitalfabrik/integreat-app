import CloseIcon from '@mui/icons-material/Close'
import { styled } from '@mui/material/styles'
import { DateTime } from 'luxon'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import buildConfig from '../constants/buildConfig'
import useLocalStorage from '../hooks/useLocalStorage'
import Button from './base/Button'
import Icon from './base/Icon'

const StyledBanner = styled('div')<{ isInstalled: boolean }>`
  display: none;
  justify-content: space-between;
  background-color: ${props => props.theme.legacy.colors.themeColor};
  padding: 15px;
  align-items: center;
  transition: all 2s ease-out;
  height: ${props => (props.isInstalled ? 'fit-content' : '80px')};

  ${props => props.theme.breakpoints.down('md')} {
    display: flex;
  }
`

const StyledDiv = styled('div')`
  display: flex;
  align-items: center;
  gap: 10px;
`

const StyledCloseButton = styled(Button)`
  display: flex;
  gap: 10px;
`

const StyledBannerIcon = styled(Icon)<{ isInstalled: boolean }>`
  width: ${props => (props.isInstalled ? '32px' : '48px')};
  height: ${props => (props.isInstalled ? '32px' : '48px')};
  border-radius: 5;
`

const StyledDivText = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
`

const StyledAppName = styled('span')`
  font-weight: bold;
  font-size: 12px;
  color: ${props => props.theme.legacy.colors.themeContrast};
`

const smallScreenSize = 400

const StyledDescription = styled('span')`
  color: ${props => props.theme.legacy.colors.themeContrast};
  white-space: nowrap;
  font-size: ${props => (props.theme.dimensions.window.width <= smallScreenSize ? '10px' : '12px')};
`

const StyledButton = styled('button')<{ isInstalled: boolean }>`
  background-color: ${props => (!props.isInstalled ? 'transparent' : props.theme.legacy.colors.textColor)};
  color: ${props =>
    !props.isInstalled ? props.theme.legacy.colors.themeContrast : props.theme.legacy.colors.themeColor};
  border: ${props => !props.isInstalled && 'none'};
  border-radius: 40px;
  padding: 6px 12px;
  height: fit-content;
  margin: 0;
  font-size: 14px;
  font-weight: bold;
  text-decoration: ${props => (props.isInstalled ? 'solid' : 'underline')};
  overflow: hidden;
`

export const MobileBanner = (): ReactElement | null => {
  const { value, updateLocalStorageItem } = useLocalStorage<string | null>({ key: 'showBanner', initialValue: null })
  const isVisible = !value || DateTime.fromISO(value).plus({ months: 3 }) < DateTime.now()
  const [isInstalled] = useState<boolean>(false) // This is always false because we can't know if app is installed or not before running the deep-link
  const { icons, appName, apps, hostName } = buildConfig()
  const appStoreUrl = `https://play.google.com/store/apps/details?id=${apps?.android.applicationId}`
  const userAgent = navigator.userAgent
  const isAndroid = Boolean(/android/i.test(userAgent))
  const { t } = useTranslation('layout')

  const checkIfAppIsInstalled = () => {
    const deepLink = `integreat://${hostName}`
    const timeoutDuration = 2000
    const checkIntervalMs = 100

    const startTime = Date.now()

    window.location.href = deepLink

    // Check if the app responds within the timeoutDuration
    const interval = setInterval(() => {
      if (Date.now() - startTime > timeoutDuration) {
        clearInterval(interval)
        window.location.href = appStoreUrl
      }
    }, checkIntervalMs)

    // Event listener for success if app is opened and page gets hidden
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        clearInterval(interval)
      }
    })
  }

  const toggleBanner = () => {
    const expirationDate = DateTime.now().plus({ months: 3 })
    updateLocalStorageItem(expirationDate.toISO())
  }

  if (isAndroid && isVisible) {
    return (
      <StyledBanner isInstalled={isInstalled}>
        <StyledDiv>
          <StyledCloseButton label='closeButton' onClick={toggleBanner}>
            {!isInstalled && <Icon src={CloseIcon} />}
          </StyledCloseButton>
          <StyledBannerIcon isInstalled={isInstalled} src={icons.appLogoMobile} />
          <StyledDivText>
            <StyledAppName>{appName}</StyledAppName>
            {!isInstalled && <StyledDescription>Tür an Tür - Digitalfabrik gGmbH</StyledDescription>}
            <StyledDescription>
              {isInstalled ? t('openInApp', { appName: buildConfig().appName }) : t('getOnPlayStore')}
            </StyledDescription>
          </StyledDivText>
        </StyledDiv>
        <StyledButton isInstalled={isInstalled} onClick={checkIfAppIsInstalled}>
          {t(isInstalled ? 'open' : 'view')}
        </StyledButton>
      </StyledBanner>
    )
  }
  return null
}
