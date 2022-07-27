export const filter = 'wirschaffendas'
export const contentSearch = 'language'
export const defaultCity = 'Testumgebung Ende-zu-Ende-Testing'
export const augsburgCity = 'Stadt Augsburg'
export const language = 'en'

const defaultCityCode = 'testumgebung-e2e'

export const Routes = {
  landing: `landing/${language}`,
  dashboard: `${defaultCityCode}/${language}`,
  dashboardAugsburg: `augsburg/${language}`,
  search: `${defaultCityCode}/${language}/search`,
}
