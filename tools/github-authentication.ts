import { createAppAuth } from '@octokit/auth-app'
import { Octokit } from '@octokit/rest'

const authenticate = async ({
  deliverinoPrivateKey,
  owner,
  repo
}: {
  deliverinoPrivateKey: string
  owner: string
  repo: string
}): Promise<Octokit> => {
  const appId = 59249 // https://github.com/apps/deliverino
  const privateKey = Buffer.from(deliverinoPrivateKey, 'base64').toString('ascii')

  const octokit = new Octokit({ authStrategy: createAppAuth, auth: { appId, privateKey } })
  const {
    data: { id: installationId }
  } = await octokit.apps.getRepoInstallation({ owner, repo })
  const {
    data: { token }
  } = await octokit.apps.createInstallationAccessToken({ installation_id: installationId })

  return new Octokit({ auth: token })
}

export default authenticate
