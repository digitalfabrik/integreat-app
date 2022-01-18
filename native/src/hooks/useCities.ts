import { useSelector } from 'react-redux'

import { CityModel } from 'api-client'

import { StateType } from '../redux/StateType'

const useCities = (): Readonly<CityModel[]> | null =>
  useSelector<StateType, Readonly<CityModel[]> | null>((state: StateType) =>
    state.cities.status === 'ready' ? state.cities.models : null
  )

export default useCities
