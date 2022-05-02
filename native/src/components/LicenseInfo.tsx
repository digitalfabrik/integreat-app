import React, { ReactElement } from 'react'
import { FlatList, View } from 'react-native'

export interface ILicense {
  licenses: string
  repository: string
  licenseUrl: string
  parents: string
}

interface IFinalLicense {
  name: string
  version: string
  licenseSpecs: ILicense
}

const LicenseInfo = (): ReactElement => {
  // TODO import file with try catch
  let licenses: ILicense[] | null = null
  licenses = require('../../../../licenses.json')
  const numberRegex = /\d+(\.\d+)*/
  const atRegex = /(?:@)/gi

  const finalLicense: IFinalLicense[] = []
  licenses?.map(license => {
    // Extract the version of the library from the name
    // const version = license. .match(numberRegex);
    console.log('license info')
    console.log(`${license.licenses}`)
    console.log(`${license.repository}`)

    // Removes the part after the @
    // const nameWithoutVersion = libraryName.replace(atRegex, '').replace(version ? version[0] : '', '');
    finalLicense.push({ name: 'nameWithoutVersion', version: '', licenseSpecs: license })
  })

  return (
    <View style={styles.root}>
      <FlatList
        data={finalLicense}
        renderItem={renderItem}
        keyExtractor={item => item.id}
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
