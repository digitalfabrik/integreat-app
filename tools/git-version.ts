import { Octokit } from '@octokit/rest'
import { program } from 'commander'

import { VERSION_FILE, PLATFORMS, tagId } from './constants'
import authenticate from './github-authentication'

program
  .requiredOption(
    '--deliverino-private-key <deliverino-private-key>',
    'private key of the deliverino github app in pem format with base64 encoding'
  )
  .requiredOption('--owner <owner>', 'owner of the current repository, usually "Integreat"')
  .requiredOption('--repo <repo>', 'the current repository, should be integreat-app')
  .requiredOption('--branch <branch>', 'the current branch')

type TagOptions = {
  versionName: string
  versionCode: number
  owner: string
  repo: string
  commitSha: string
  appOctokit: Octokit
  platform: string
}

const createTag = async ({ versionName, versionCode, owner, repo, commitSha, appOctokit, platform }: TagOptions) => {
  const id = tagId({ versionName, platform })
  const tagMessage = `[${platform}] ${versionName} - ${versionCode}`

  const tag = await appOctokit.git.createTag({
    owner,
    repo,
    tag: id,
    message: tagMessage,
    object: commitSha,
    type: 'commit'
  })
  const tagSha = tag.data.sha
  console.warn(`New tag with id ${id} successfully created.`)

  await appOctokit.git.createRef({
    owner,
    repo,
    ref: `refs/tags/${id}`,
    sha: tagSha
  })
  console.warn(`New ref with id ${id} successfully created.`)
}

const commitAndTag = async (
  versionName: string,
  versionCodeString: string,
  {
    deliverinoPrivateKey,
    owner,
    repo,
    branch
  }: { deliverinoPrivateKey: string; owner: string; repo: string; branch: string }
) => {
  if (branch !== 'main') {
    throw new Error('Version bumps are only allowed on the main branch!')
  }

  const appOctokit = await authenticate({ deliverinoPrivateKey, owner, repo })
  const versionFileContent = await appOctokit.repos.getContent({ owner, repo, path: VERSION_FILE, ref: branch })

  const versionCode = parseInt(versionCodeString, 10)
  if (Number.isNaN(versionCode)) {
    throw new Error(`Failed to parse version code string: ${versionCodeString}`)
  }

  const contentBase64 = Buffer.from(JSON.stringify({ versionName, versionCode })).toString('base64')

  const commitMessage = `Bump version name to ${versionName} and version code to ${versionCode}\n[skip ci]`

  const commit = await appOctokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path: VERSION_FILE,
    content: contentBase64,
    branch,
    message: commitMessage,
    // @ts-expect-error Random typescript error: property sha is not available on type { ..., sha: string, ... }
    sha: versionFileContent.data.sha
  })
  console.warn(`New version successfully commited with message "${commitMessage}".`)

  const commitSha = commit.data.commit.sha

  await Promise.all(
    PLATFORMS.map(platform =>
      createTag({
        versionName,
        versionCode,
        commitSha: commitSha!,
        appOctokit,
        owner,
        repo,
        platform
      })
    )
  )
}

program
  .command('bump-to <new-version-name> <new-version-code>')
  .description('commits the supplied version name and code to github and tags the commit')
  .action(async (newVersionName, newVersionCode) => {
    try {
      await commitAndTag(newVersionName, newVersionCode, {
        deliverinoPrivateKey: program.deliverinoPrivateKey,
        branch: program.branch,
        owner: program.owner,
        repo: program.repo
      })
    } catch (e) {
      console.error(e)
      process.exit(1)
    }
  })

program.parse(process.argv)
