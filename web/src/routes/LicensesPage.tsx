import React, { ReactElement, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { License, parseLicenses } from 'api-client/src/utils/licences'

import Caption from '../components/Caption'
import Layout from '../components/Layout'
import LicenseItem from '../components/LicenseItem'
import List from '../components/List'
import { reportError } from '../utils/sentry'

const LicensesPage = (): ReactElement => {
  const { t } = useTranslation('settings')
  const [licenses, setLicenses] = useState<License[] | null>(null)

  useEffect(() => {
    import('../../assets/licenses.json')
      .then(licenseFile => setLicenses(parseLicenses(licenseFile.default)))
      .catch(error => reportError(`error while importing licenses ${error}`))
  }, [])

  const renderItem = (item: License) => (
    <LicenseItem name={item.name} license={item.licenses} version={item.version} onPress={item.licenseUrl} />
  )

  return (
    <Layout>
      <Caption title={t('settings:openSourceLicenses')} />
      <List items={licenses ?? []} renderItem={renderItem} noItemsMessage='' />
    </Layout>
  )
}

export default LicensesPage
