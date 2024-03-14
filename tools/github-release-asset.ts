import { program } from 'commander'
import fs from 'node:fs'

import authenticate from './github-authentication.js'

type Options = {
  deliverinoPrivateKey: string
  owner: string
  repo: string
  releaseId: number
  files: string
}

const uploadAsset = async ({ deliverinoPrivateKey, owner, repo, releaseId, files }: Options) => {
  const appOctokit = await authenticate({ deliverinoPrivateKey, owner, repo })

  files.split('\n').forEach(async file => {
    console.log(`Uploading ${file}`)
    const fileData = fs.readFileSync(file)
    await appOctokit.rest.repos.uploadReleaseAsset({
      owner,
      repo,
      release_id: releaseId,
      name: file.split('/')[1] ?? 'unknown',
      data: fileData as unknown as string,
    })
  })
}

program
  .command('upload')
  .description('Upload a release asset to github')
  .requiredOption(
    '--deliverino-private-key <deliverino-private-key>',
    'private key of the deliverino github app in pem format with base64 encoding',
  )
  .requiredOption('--owner <owner>', 'owner of the current repository, usually "digitalfabrik"')
  .requiredOption('--repo <repo>', 'the current repository, should be integreat-app')
  .requiredOption('--releaseId <releaseId>', 'The unique identifier of the release.')
  .requiredOption('--files <files>', 'The name of the files to upload.')
  .action(async (options: Options) => {
    try {
      await uploadAsset(options)
    } catch (e) {
      console.error(e)
      process.exit(1)
    }
  })

program.parse(process.argv)
