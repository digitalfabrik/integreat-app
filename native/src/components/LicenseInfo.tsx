import React, { ReactElement, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList } from 'react-native'
import { reportError } from '../utils/sentry'
import useSnackbar from '../hooks/useSnackbar'

import openExternalUrl from '../utils/openExternalUrl'
import Caption from './Caption'
import Layout from './Layout'
import SettingItem from './SettingItem'
import FinalLicense from '../../../api-client/src/utils/LicenseHelpers'



const numberRegex = /\d+(\.\d+)*/
const versionFilterRegex = /(?:@)\d+(\.\d+)*/
const LicenseInfo = (): ReactElement => {
  const [licenses, setLicenses] = useState<FinalLicense[] | null>(null)

  const parseLicenses = () => {
    import('../../../../assets/licenses_native.json').then(licenseFile => {
      const licenseInfos = licenseFile.default
      const finalLicenses = Object.entries(licenseInfos).map(info => {
        // Extract the version of the library from the name
        const versionMatch = info[0].match(numberRegex)
        const version = versionMatch !== null ? versionMatch[0] : ''

        // get license name without version in it
        const nameWithoutVersion = info[0].replace(versionFilterRegex, '')
        return { name: nameWithoutVersion, version, licenseSpecs: info[1] }
      })
      setLicenses(finalLicenses)
    })
    .catch(error =>  reportError(`error while importing licenses ${error}`) ) 
      // eslint-disable-next-line no-console
     
  }

  const showSnackbar = useSnackbar()
  useEffect(() => {
    try {
      parseLicenses()
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('error when loading licenses.json')
    }
  }, [])

  const { t } = useTranslation('settings')
  const renderItem = ({ item }: { item: FinalLicense }) => {
    const openLink = () => {
      openExternalUrl(item.licenseSpecs.licenseUrl).catch(() => showSnackbar("something went wrong"))
    }

    return (
        <SettingItem
          value={false}
          accessibilityRole='link'
          onPress={openLink}
          title={item.name}
          description={`  Version: ${item.version} \n  License: ${item.licenseSpecs.licenses}`}
        />
    )
  }

  return (
    <Layout>
      <Caption title={t('openSourceLicenses')} />
      <FlatList data={licenses} renderItem={renderItem} keyExtractor={item => item.name} />
    </Layout>
  )
}

export default LicenseInfo
