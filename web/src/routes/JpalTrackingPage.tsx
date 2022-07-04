import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { setJpalTrackingCode } from 'api-client'

import safeLocalStorage, { JPAL_TRACKING_CODE_KEY } from '../utils/safeLocalStorage'

const JpalTrackingPage = (): null => {
  const trackingCode = useParams().trackingCode
  const navigate = useNavigate()

  useEffect(() => {
    if (trackingCode) {
      safeLocalStorage.setItem(JPAL_TRACKING_CODE_KEY, trackingCode)
    } else {
      safeLocalStorage.removeItem(JPAL_TRACKING_CODE_KEY)
    }
    setJpalTrackingCode(trackingCode ?? null)

    navigate('/', { replace: true })
  }, [trackingCode, navigate])

  return null
}

export default JpalTrackingPage
