import { useCallback } from 'react'

import { RegionModel, createRegionsEndpoint, ReturnType, useLoadAsync, fromError } from 'shared/api'

import { SnackbarType } from '../components/SnackbarContainer'
import dataContainer from '../utils/DefaultDataContainer'
import { determineApiUrl } from '../utils/helpers'
import useSnackbar from './useSnackbar'

const loadWithCache = async ({
  showSnackbar,
  forceUpdate = false,
}: {
  forceUpdate?: boolean
  showSnackbar: (snackbar: SnackbarType) => void
}): Promise<RegionModel[] | null> => {
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
      showSnackbar({ text: fromError(e) })
    }
  }
  return cachedData
}

const useLoadRegions = (): ReturnType<RegionModel[]> => {
  const showSnackbar = useSnackbar()
  return useLoadAsync(useCallback(forceUpdate => loadWithCache({ showSnackbar, forceUpdate }), [showSnackbar]))
}

export default useLoadRegions
