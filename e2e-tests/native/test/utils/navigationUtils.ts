import { openDeepLinkUrl } from '../helpers/openDeepLink'
import DashboardPage from '../pageobjects/dashboard.page'

export const navigateToDashboard = async (): Promise<void> => {
  await openDeepLinkUrl("integreat.app/testumgebung-e2e/de")
  expect(await DashboardPage.exists()).toBeTruthy()
}
