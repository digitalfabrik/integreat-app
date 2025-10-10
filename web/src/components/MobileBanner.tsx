import CloseIcon from '@mui/icons-material/Close'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import { DateTime } from 'luxon'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import SVG from 'react-inlinesvg'

import buildConfig from '../constants/buildConfig'
import useLocalStorage from '../hooks/useLocalStorage'

const StyledBanner = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: 8,
  height: 80,
  transition: 'all 2s ease-out',
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.secondary.contrastText,
}))

const Logo = styled(SVG)({
  height: 48,
  width: 48,
})

const MobileBanner = (): ReactElement | null => {
  const { value, updateLocalStorageItem } = useLocalStorage<string | null>({ key: 'showBanner', initialValue: null })
  const isVisible = !value || DateTime.fromISO(value).plus({ months: 3 }) < DateTime.now()
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

  const closeBanner = () => {
    const expirationDate = DateTime.now().plus({ months: 3 })
    updateLocalStorageItem(expirationDate.toISO())
  }

  if (isAndroid && isVisible) {
    return (
      <StyledBanner>
        <Stack direction='row' alignItems='center' gap={1}>
          <IconButton onClick={closeBanner} aria-label={t('common:close')} color='inherit'>
            <CloseIcon />
          </IconButton>
          <Logo src={icons.appLogoMobile} />
          <Stack>
            <Typography variant='title3'>{appName}</Typography>
            <Typography variant='body3'>Tür an Tür - Digitalfabrik gGmbH</Typography>
            <Typography variant='body3'>{t('getOnPlayStore')}</Typography>
          </Stack>
        </Stack>
        <Button onClick={checkIfAppIsInstalled} color='inherit'>
          {t('view')}
        </Button>
      </StyledBanner>
    )
  }
  return null
}

export default MobileBanner
