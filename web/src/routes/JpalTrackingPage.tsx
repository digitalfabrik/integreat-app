import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'

import { setJpalTrackingCode } from 'shared/api'

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
