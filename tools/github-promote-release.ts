import { Octokit } from '@octokit/rest'
import { GetResponseTypeFromEndpointMethod } from '@octokit/types'
import { program } from 'commander'

import authenticate from './github-authentication.js'

const octokit = new Octokit()
type Releases = GetResponseTypeFromEndpointMethod<typeof octokit.repos.listReleases>
type ReleaseType = Releases['data'][number]

type Options = {
  deliverinoPrivateKey: string
  owner: string
  repo: string
  platform: 'web' | 'android' | 'ios'
}

const getAllPreReleased = async ({ deliverinoPrivateKey, owner, repo, platform }: Options) => {
  const appOctokit = await authenticate({ deliverinoPrivateKey, owner, repo })

  const releases: Releases = await appOctokit.rest.repos.listReleases({
    owner,
    repo,
  })
  const releasesWithTags = releases.data.filter(
    (release: ReleaseType) => release.tag_name.includes(platform) && release.prerelease,
  )
  const filteredIds = releasesWithTags.map((release: ReleaseType) => release.id)
  const filteredTagNames = releasesWithTags.map((release: ReleaseType) => release.tag_name)

  if (filteredIds.length > 0) {
    console.warn('Unset prerelease tags of ', filteredTagNames)
    return filteredIds
  }

  console.warn('No release found to unset the prerelease tag for. Latest release may already be non-prerelease')
  return null
}

const removePreRelease = async ({ deliverinoPrivateKey, owner, repo, platform }: Options) => {
  const allPreReleases = await getAllPreReleased({ deliverinoPrivateKey, owner, repo, platform })
  if (!allPreReleases) {
    return null
  }
  const appOctokit = await authenticate({ deliverinoPrivateKey, owner, repo })
  await Promise.all(
    allPreReleases.map(async (preRelease: ReleaseType) => {
      const result = await appOctokit.rest.repos.updateRelease({
        owner,
        repo,
        release_id: preRelease.id,
        prerelease: false,
        make_latest: platform === 'android' ? 'true' : 'false', // We always want android to be the latest release, so a link to the latest github release will go to the apk
      })
      console.warn('Http response code of updating the result: ', result.status)
    }),
  )
  return allPreReleases
}

program
  .command('promote')
  .description('Remove pre-release flag from the latest release')
  .requiredOption(
    '--deliverino-private-key <deliverino-private-key>',
    'private key of the deliverino github app in pem format with base64 encoding',
  )
  .requiredOption('--owner <owner>', 'owner of the current repository, usually "digitalfabrik"')
  .requiredOption('--repo <repo>', 'the current repository, should be integreat-app')
  .requiredOption('--platform <platform>')
  .action(async (options: Options) => {
    try {
      const promotedReleases = await removePreRelease(options)
      if (promotedReleases) {
        console.log(`The most recent beta version was promoted to production:`)
        promotedReleases.map((release: ReleaseType) => console.log(`\n[${release.name}](${release.html_url})`))
      }
    } catch (e) {
      console.error(e)
      process.exit(1)
    }
  })

program.parse(process.argv)
