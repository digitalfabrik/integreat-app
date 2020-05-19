#!/usr/bin/node

const { Octokit } = require('@octokit/rest')
const { createAppAuth } = require('@octokit/auth-app')
const fs = require('fs').promises

const bumpVersion = async () => {
  try {
    const versionPath = 'version.json'

    const versionFile = await fs.readFile(versionPath)
    const { versionName, versionCode } = JSON.parse(versionFile)
    const versionNameParts = versionName.split('.')

    const date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth() + 1

    const versionNameCounter = year === versionNameParts[0] && month === versionNameParts[1] ? versionNameParts[2] + 1 : 0
    const newVersionName = `${year}.${month}.${versionNameCounter}`
    const newVersionCode = versionCode ? versionCode + 1 : undefined

    const newVersion = {
      versionName: newVersionName,
      versionCode: newVersionCode
    }

    const message = versionCode
      ? `Bump version name to ${newVersionName} and version code to ${newVersionCode}\n[skip ci]`
      : `Bump version name to ${newVersionName}\n[skip ci]`

    await commitVersionBump(versionPath, JSON.stringify(newVersion), message)
    process.exit(0)
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

const commitVersionBump = async (path, content, message) => {
  const privateKeyBase64 = process.env.DELIVERINO_PRIVATE_KEY
  const owner = process.env.CIRCLE_PROJECT_USERNAME
  const repo = process.env.CIRCLE_PROJECT_REPONAME
  const branch = process.env.CIRCLE_BRANCH
  const appId = 59249 // https://github.com/apps/deliverino

  const privateKey = Buffer.from(privateKeyBase64, 'base64').toString('ascii')

  const octokit = new Octokit({ authStrategy: createAppAuth, auth: { id: appId, privateKey: privateKey } })
  const { data: { id: installation_id } } = await octokit.apps.getRepoInstallation({ owner, repo })
  const { data: { token: installationToken } } = await octokit.apps.createInstallationToken({ installation_id })

  const appOctokit = new Octokit({ auth: installationToken })
  const versionFileContent = await appOctokit.repos.getContents({ owner, repo, path, ref: branch })

  const contentBase64 = Buffer.from(content).toString('base64')

  await appOctokit.repos.createOrUpdateFile({
    owner,
    repo,
    path,
    content: contentBase64,
    branch,
    message,
    sha: versionFileContent.data.sha
  })
}

bumpVersion()
