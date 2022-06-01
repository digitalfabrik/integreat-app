import React, { ReactElement, useEffect, useState } from 'react'
import { FlatList, View } from 'react-native'
import { Button } from 'react-native-elements/dist/buttons/Button'
import { Item } from 'react-navigation-header-buttons'

export type ILicense = {
  licenses: string
  repository: string
  licenseUrl: string
  parents: string
}

type IFinalLicense = {
  name: string
  version: string
  licenseSpecs: ILicense
}

const LicenseInfo = (): ReactElement => {
  // TODO import file with try catch
  const [licenses, setLicenses] = useState<ILicense[] | null>(null)
  useEffect(() => {
    try {
      const license_file = require('../../../../assets/licenses_native.json')
      console.log('test', license_file)
      setLicenses(license_file)
    } catch (error) {
      console.log('error when loading licenses.json')
    }
  }, [])
  const numberRegex = /\d+(\.\d+)*/
  const atRegex = /(?:@)/gi

  const finalLicenses: IFinalLicense[] = []
  //   licenses?.map(license => {
  //     // Extract the version of the library from the name
  //     // const version = license. .match(numberRegex);
  //     console.log('license info')
  //     console.log(`${license.licenses}`)
  //     console.log(`${license.repository}`)
  // return null
  //     // Removes the part after the @
  //     // const nameWithoutVersion = libraryName.replace(atRegex, '').replace(version ? version[0] : '', '');
  //     finalLicenses.push({ name: 'nameWithoutVersion', version: '', licenseSpecs: license })
  //   })

  return (
    <View>
      {/* <Button title='Test' onPress={() => {}} /> */}
      <FlatList
        data={finalLicenses}
        renderItem={item => <Item title={item.item.name} />}
        keyExtractor={item => item.name}
        // keyboardShouldPersistTaps={'handled'}
        // data={finalLicense}
        // contentContainerStyle={styles.listContainer}
        // // renderItem={({ item }) => {
        // //   return this.renderItem(item);
        // // }}
        // ItemSeparatorComponent={this.renderSeparator}
        // extraData={this.state}
        // keyExtractor={(item, index) => index.toString()}
      />
    </View>
  )
}

export default LicenseInfo
