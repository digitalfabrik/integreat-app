import { program } from 'commander'

import { tagId } from './constants'
import authenticate from './github-authentication'

program
  .requiredOption(
    '--deliverino-private-key <deliverino-private-key>',
    'private key of the deliverino github app in pem format with base64 encoding'
  )
  .requiredOption('--owner <owner>', 'owner of the current repository, usually "Integreat"')
  .requiredOption('--repo <repo>', 'the current repository, should be integreat-app')
  .requiredOption('--release-notes <release-notes>', 'the release notes (for the selected platform) as JSON string')
  .option('--download-links <download-links>', 'the download links of the artifacts (for the selected platform)')
  .option('--development-release', 'whether the release is a development release which is not delivered to production')
  .option('--dry-run', 'dry run without actually creating a release on github')

type Options = {
  deliverinoPrivateKey: string
  owner: string
  repo: string
  releaseNotes: string
  downloadLinks: string
  developmentRelease: boolean
  dryRun: boolean
}

const githubRelease = async (
  platform: string,
  newVersionName: string,
  newVersionCode: string,
  { deliverinoPrivateKey, owner, repo, releaseNotes, downloadLinks, developmentRelease, dryRun }: Options
) => {
  const versionCode = parseInt(newVersionCode, 10)
  if (Number.isNaN(versionCode)) {
    throw new Error(`Failed to parse version code string: ${newVersionCode}`)
  }

  const releaseName = `[${platform}${
    developmentRelease ? ' development release' : ''
  }] ${newVersionName} - ${versionCode}`
  console.warn('Creating release with name ', releaseName)

  const developmentMessage = developmentRelease
    ? 'This release is only delivered to development and not yet visible for users.\n\n'
    : ''

  const body = `${developmentMessage}${JSON.parse(releaseNotes)}${
    downloadLinks ? `\nArtifacts:\n${downloadLinks}` : ''
  }`
  console.warn('and body ', body)

  if (dryRun) {
    return
  }

  const appOctokit = await authenticate({ deliverinoPrivateKey, owner, repo })

  await appOctokit.repos.createRelease({
    owner,
    repo,
    tag_name: tagId({ versionName: newVersionName, platform }),
    name: releaseName,
    body
  })
}

program
  .command('create <platform> <new-version-name> <new-version-code>')
  .description('creates a new release for the specified platform')
  .action(async (platform, newVersionName, newVersionCode) => {
    try {
      await githubRelease(platform, newVersionName, newVersionCode, {
        deliverinoPrivateKey: program.deliverinoPrivateKey,
        repo: program.repo,
        owner: program.owner,
        developmentRelease: program.developmentRelease,
        downloadLinks: program.downloadLinks,
        releaseNotes: program.releaseNotes,
        dryRun: program.dryRun
      })
    } catch (e) {
      console.error(e)
      process.exit(1)
    }
  })

program.parse(process.argv)
