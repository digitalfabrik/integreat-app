export const filter = 'wirschaffendas'
export const contentSearch = 'language courses'
export const defaultCity = 'E2E-Testumgebung'
export const augsburgCity = 'Stadt Augsburg'
export const language = 'en'

const defaultCityCode = 'testumgebung-e2e'

export const Routes = {
  landing: `landing/${language}`,
  dashboard: `${defaultCityCode}/${language}`,
  dashboardAugsburg: `augsburg/${language}`,
  search: `${defaultCityCode}/${language}/search`,
}
