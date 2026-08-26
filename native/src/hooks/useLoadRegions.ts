import { TFunction } from 'i18next'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { RegionModel, createRegionsEndpoint, ReturnType, useLoadAsync, fromError } from 'shared/api'

import { getErrorMessage } from '../components/Failure'
import { SnackbarType } from '../components/SnackbarContainer'
import dataContainer from '../utils/DefaultDataContainer'
import { determineApiUrl } from '../utils/helpers'
import useSnackbar from './useSnackbar'

type LoadWithCacheProps = {
  forceUpdate?: boolean
  showSnackbar: (snackbar: SnackbarType) => void
  t: TFunction
}

const loadWithCache = async ({
  showSnackbar,
  forceUpdate = false,
  t,
}: LoadWithCacheProps): Promise<RegionModel[] | null> => {
  const cachedData = (await dataContainer.regionsAvailable()) ? await dataContainer.getRegions() : null

  if (!forceUpdate && cachedData) {
    return cachedData
  }

  try {
    const payload = await createRegionsEndpoint(await determineApiUrl()).request()
    if (payload.data) {
      await dataContainer.setRegions(payload.data)
    }
    return payload.data ?? cachedData
  } catch (e) {
    if (!cachedData) {
      throw e
    }
    if (forceUpdate) {
      showSnackbar({ text: getErrorMessage(fromError(e), t) })
    }
  }
  return cachedData
}

const useLoadRegions = (): ReturnType<RegionModel[]> => {
  const { t } = useTranslation()
  const showSnackbar = useSnackbar()

  return useLoadAsync(useCallback(forceUpdate => loadWithCache({ showSnackbar, forceUpdate, t }), [showSnackbar, t]))
}

export default useLoadRegions
