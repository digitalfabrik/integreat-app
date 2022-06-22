import React, { ReactElement, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, View } from 'react-native'
import openExternalUrl from '../utils/openExternalUrl'
import Caption from './Caption'
import SettingItem from './SettingItem'

export type ILicense = {
  licenses: string
  repository: string
  licenseUrl: string
  parents: string
}

type IFinalLicense = {
  name: string
  version?: string
  licenseSpecs: ILicense
}

const numberRegex = /\d+(\.\d+)*/
const atRegex = /(?:@)/gi
const LicenseInfo = (showSnackbar: (message: string) => void): ReactElement => {
  const [licenses, setLicenses] = useState<IFinalLicense[] | null>(null)

  useEffect(() => {
    try {
      import('../../../../assets/licenses_native.json').then(licenseFile => {
        const licenseInfos: ILicense[] = JSON.parse(JSON.stringify(licenseFile))
        const finalLicenses = Object.entries(licenseInfos).map(info => {

          // Extract the version of the library from the name
          const versionMatch = info[0].match(numberRegex)
          const version = versionMatch !== null ? versionMatch[0] : ''

          // get license name without version in it
          const nameWithoutVersion = info[0].replace(atRegex, '').replace(version ?? '', '')
          return { name: nameWithoutVersion, version, licenseSpecs: info[1] }
        })
        setLicenses(finalLicenses)
      })
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('error when loading licenses.json')
    }
  }, [])

  const { t } = useTranslation('settings')
  const renderItem = ({ item }: { item: IFinalLicense }) => {
    const openLink = () => {
      openExternalUrl(item.licenseSpecs.licenseUrl).catch((error: Error) => showSnackbar(error.message))
    }

    return (
      <>
      <SettingItem
        value={false}
        hasSwitch={false}
        hasBadge={false}
        bigTitle={false}
        accessibilityRole='link'
        onPress={openLink}
        title={item.name}
        description={`  Version: ${item.version} \n  License: ${item.licenseSpecs.licenses}`}
      />
      </>
    )
  }

  return (
    <View>
      <Caption title={t('openSourceLicenses')}/>
      <FlatList data={licenses} renderItem={renderItem} keyExtractor={item => item.name} />
    </View>
  )
}

export default LicenseInfo
