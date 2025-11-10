export type JsonLicenses = {
  [name: string]: {
    licenses: string
    repository?: string
    publisher?: string
  }
}

export type License = {
  name: string
  version: string | undefined
  licenses: string
  repository: string | undefined
  publisher: string | undefined
}

// matches version number e.g. 1.0.2
const versionNumberRegex = /\d+(\.\d+)*/

// matches @versionNumber e.g. @1.0.2
const versionRegex = /(?:@)\d+(\.\d+)*/

export const parseLicenses = (licenseFile: JsonLicenses): License[] =>
  Object.entries(licenseFile).map(([name, { licenses, repository, publisher }]) => {
    const version = name.match(versionNumberRegex)?.[0] ?? ''
    const nameWithoutVersion = name.replace(versionRegex, '')
    return { name: nameWithoutVersion, version, repository, licenses, publisher }
  })
