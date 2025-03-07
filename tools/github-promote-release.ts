import { Octokit } from '@octokit/rest'
import { GetResponseTypeFromEndpointMethod } from '@octokit/types'
import { program } from 'commander'

import authenticate from './github-authentication.js'

const octokit = new Octokit()
type Releases = GetResponseTypeFromEndpointMethod<typeof octokit.repos.listReleases>

type Options = {
  deliverinoPrivateKey: string
  owner: string
  repo: string
  platform: 'web' | 'android' | 'ios'
}

const getReleaseIdBody = async ({ deliverinoPrivateKey, owner, repo, platform }: Options) => {
  const appOctokit = await authenticate({ deliverinoPrivateKey, owner, repo })

  const releases: Releases = await appOctokit.rest.repos.listReleases({
    owner,
    repo,
  })

  const result = releases.data.find(release => release.tag_name.includes(platform))
  if (result && result.prerelease) {
    console.warn('Unset prerelease tag of ', result.tag_name)
    return result
  }

  console.warn('No release found to unset the prerelease tag for. Latest release may already be non-prerelease')
  return null
}

const removePreRelease = async ({ deliverinoPrivateKey, owner, repo, platform }: Options) => {
  const release = await getReleaseIdBody({ deliverinoPrivateKey, owner, repo, platform })
  if (!release) {
    return null
  }
  const appOctokit = await authenticate({ deliverinoPrivateKey, owner, repo })
  const result = await appOctokit.rest.repos.updateRelease({
    owner,
    repo,
    release_id: release.id,
    prerelease: false,
    make_latest: platform === 'android' ? 'true' : 'false', // We always want android to be the latest release, so a link to the latest github release will go to the apk
  })
  console.warn('Http response code of updating the result: ', result.status)
  return release
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
      const promotedRelease = await removePreRelease(options)
      if (promotedRelease) {
        console.log(
          `The most recent beta version was promoted to production:\n[${promotedRelease.name}](${promotedRelease.html_url})`,
        )
      }
    } catch (e) {
      console.error(e)
      process.exit(1)
    }
  })

program.parse(process.argv)
