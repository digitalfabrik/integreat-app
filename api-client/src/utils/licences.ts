export type JsonLicenses = {
  [name: string]: {
    licenses: string
    licenseUrl: string
  }
}

export type License = {
  name: string
  version: string | undefined
  licenses: string
  licenseUrl: string
}

const numberRegex = /\d+(\.\d+)*/
const versionRegex = /(?:@)\d+(\.\d+)*/

export const parseLicenses = (licenseFile: JsonLicenses): License[] =>
  Object.entries(licenseFile).map(([name, { licenses, licenseUrl }]) => {
    // Extract the version and the name
    const version = name.match(numberRegex)?.[0] ?? ''
    const nameWithoutVersion = name.replace(versionRegex, '')
    const correctedUrl = licenseUrl.replace('/github:/', 'https://github.com' )
    return { name: nameWithoutVersion, version, licenseUrl: correctedUrl, licenses }
  })
