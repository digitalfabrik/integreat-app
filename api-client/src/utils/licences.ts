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

// matches version number e.g. 1.0.2
const versionNumberRegex = /\d+(\.\d+)*/

// matches @versionNumber e.g. @1.0.2
const versionRegex = /(?:@)\d+(\.\d+)*/

export const parseLicenses = (licenseFile: JsonLicenses): License[] =>
  Object.entries(licenseFile).map(([name, { licenses, licenseUrl }]) => {
    const version = name.match(versionNumberRegex)?.[0] ?? ''
    const nameWithoutVersion = name.replace(versionRegex, '')
    const correctedUrl = licenseUrl.replace('github:', 'https://github.com/')
    return { name: nameWithoutVersion, version, licenseUrl: correctedUrl, licenses }
  })
