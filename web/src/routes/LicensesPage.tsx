import React, { ReactElement, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { License, LICENSES_ROUTE, parseLicenses, pathnameFromRouteInformation } from 'api-client'

import { CityRouteProps } from '../CityContentSwitcher'
import Caption from '../components/Caption'
import LicenseItem from '../components/LicenseItem'
import List from '../components/List'
import LocationLayout from '../components/LocationLayout'
import useWindowDimensions from '../hooks/useWindowDimensions'
import { reportError } from '../utils/sentry'

const LicensesPage = ({ languageCode, pathname, cityModel, languages, cityCode }: CityRouteProps): ReactElement => {
  const { t } = useTranslation(['settings', 'licenses'])
  const [licenses, setLicenses] = useState<License[] | null>(null)
  const { viewportSmall } = useWindowDimensions()

  useEffect(() => {
    import('../../assets/licenses.json')
      .then(licenseFile => setLicenses(parseLicenses(licenseFile.default)))
      .catch(error => reportError(`error while importing licenses ${error}`))
  }, [])

  const renderItem = (item: License) => (
    <LicenseItem name={item.name} license={item.licenses} version={item.version} onPress={item.licenseUrl} />
  )

  const languageChangePaths = languages.map(({ code, name }) => {
    const disclaimerPath = pathnameFromRouteInformation({ route: LICENSES_ROUTE, cityCode, languageCode: code })
    return { path: disclaimerPath, name, code }
  })

  const locationLayoutParams = {
    cityModel,
    viewportSmall,
    languageChangePaths,
    feedbackTargetInformation: null,
    route: LICENSES_ROUTE,
    languageCode,
    pathname,
  }

  return (
    <LocationLayout isLoading={false} {...locationLayoutParams}>
      <Caption title={t('settings:openSourceLicenses')} />
      <List items={licenses ?? []} renderItem={renderItem} noItemsMessage={t('licenses:noLicensesMessage')} />
    </LocationLayout>
  )
}

export default LicensesPage
