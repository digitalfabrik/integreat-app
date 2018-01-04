// Contains mocks which are used before any test runs
// todo: We don't want to have these mocks. So this will be fixed in WEBAPP-170
import LocationModel from './modules/endpoint/models/LocationModel'

export const mockLocations = [
  new LocationModel({name: 'Augsburg', code: 'augsburg'}),
  new LocationModel({name: 'Stadt Regensburg', code: 'regensburg'}),
  new LocationModel({name: 'Werne', code: 'werne'})
]
