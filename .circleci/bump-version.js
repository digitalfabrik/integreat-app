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
  const installationId = 7668676

  const privateKey = Buffer.from(privateKeyBase64, 'base64').toString('ascii')

  const app = new App({ id: appId, privateKey })
  const installationAccessToken = await app.getInstallationAccessToken({ installationId })

  const octokit = new Octokit()
  await octokit.auth({
    type: 'token',
    token: installationAccessToken
  })

  console.log(branch)

  await octokit.repos.createOrUpdateFile({
    owner,
    repo,
    path,
    content,
    branch,
    message
  })
}

bumpVersion()
