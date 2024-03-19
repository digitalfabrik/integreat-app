import { program } from 'commander'

import { tagId } from './constants.js'
import authenticate from './github-authentication.js'

type Options = {
  deliverinoPrivateKey: string
  owner: string
  repo: string
  releaseNotes: string
  productionDelivery: string
}

const githubRelease = async (
  platform: string,
  newVersionName: string,
  newVersionCode: string,
  { deliverinoPrivateKey, owner, repo, releaseNotes, productionDelivery }: Options,
): Promise<void> => {
  const versionCode = parseInt(newVersionCode, 10)
  if (Number.isNaN(versionCode)) {
    throw new Error(`Failed to parse version code string: ${newVersionCode}`)
  }

  console.log('production_delivery: ', productionDelivery)
  console.log('productionDelivery === true: ', productionDelivery === 'true')
  console.log('productionDelivery === false: ', productionDelivery === 'false')

  const releaseName = `[${platform}] ${newVersionName} - ${versionCode}`
  const body = JSON.parse(releaseNotes)
  const appOctokit = await authenticate({ deliverinoPrivateKey, owner, repo })

  // const release = await appOctokit.repos.createRelease({
  //   owner,
  //   repo,
  //   tag_name: tagId({ versionName: newVersionName, platform }),
  //   prerelease: prerelease === 'true',
  //   make_latest: platform === 'android' ? 'true' : 'false',
  //   name: releaseName,
  //   body,
  // })

  // This command returns the release id of the created release, which is later needed to make updates for this release.
  //console.log(release.data.id)
}

program
  .command('create <platform> <new-version-name> <new-version-code>')
  .description('creates a new release for the specified platform')
  .requiredOption(
    '--deliverino-private-key <deliverino-private-key>',
    'private key of the deliverino github app in pem format with base64 encoding',
  )
  .requiredOption('--owner <owner>', 'owner of the current repository, usually "digitalfabrik"')
  .requiredOption('--repo <repo>', 'the current repository, should be integreat-app')
  .requiredOption('--release-notes <release-notes>', 'the release notes (for the selected platform) as JSON string')
  .requiredOption('--production-delivery <production-delivery>', 'weather this is a production build or not')
  .action(async (platform: string, newVersionName: string, newVersionCode: string, options: Options) => {
    try {
      await githubRelease(platform, newVersionName, newVersionCode, options)
    } catch (e) {
      console.error(e)
      process.exit(1)
    }
  })

program.parse(process.argv)
