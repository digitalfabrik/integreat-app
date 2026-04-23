export const filter = 'wirschaffendas'
export const contentSearch = 'language courses'
export const defaultRegion = 'E2E-Testumgebung'
export const augsburgRegion = 'Stadt Augsburg'
export const language = 'en'

const defaultRegionCode = 'testumgebung-e2e'

export const Routes = {
  landing: `landing/${language}`,
  dashboard: `${defaultRegionCode}/${language}`,
  dashboardAugsburg: `augsburg/${language}`,
  search: `${defaultRegionCode}/${language}/search`,
}
