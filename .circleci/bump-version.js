#!/usr/bin/node

const { Octokit } = require('@octokit/rest')
const { App } = require('@octokit/app')
const jwt = require('jsonwebtoken')
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

    const versionNameCounter = year === versionNameParts[0] && month === versionNameParts[1] ? versionNameParts[3] + 1 : 0
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
  const appId = 59249

  const privateKey = new Buffer(privateKeyBase64, 'base64').toString('ascii')

  // const app = new App({ id: appId, privateKey: privateKey })
  // const installationAccessToken = await app.getInstallationAccessToken({
  //   installationId,
  // })

  // https://github.com/octokit/rest.js/issues/1101#issuecomment-437629072
  const now = Math.floor(Date.now() / 1000)
  const payload = {
    iat: now,
    exp: now + 60,
    iss: appId
  }
  const webToken = jwt.sign(payload, privateKey, { algorithm: 'RS256' })

  const octokit = new Octokit({
    type: 'app',
    token: webToken
  })

  const installation = await octokit.apps.getRepoInstallation({
    owner,
    repo
  })
  console.log(installation)

  const { token } = await octokit.apps.createInstallationToken({ installationId: installation.id })
  console.log(token)

  await octokit.authenticate({
    type: 'token',
    token
  })

  await octokit.repos.createOrUpdateFile({
    owner,
    repo,
    path,
    content,
    branch,
    message
  })
  console.log('upated')
}

bumpVersion()
