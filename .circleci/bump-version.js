#!/usr/bin/node

const { Octokit } = require('@octokit/rest')
const { createAppAuth } = require("@octokit/auth-app")
const fs = require('fs').promises

const bumpVersion = async () => {
  try {
    const versionPath = 'version.json'

    const versionFile = await fs.readFile(versionPath)
    const { versionName, versionCode } = JSON.parse(versionFile)
    console.log(versionName)
    console.log(versionCode)

    const versionNameParts = versionName.split('.')

    const date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth() + 1

    const versionNameCounter = year === versionNameParts[0] && month === versionNameParts[1] ? versionNameParts[3] + 1 : 0
    const newVersionName = `${year}.${month}.${versionNameCounter}`
    const newVersionCode = versionCode ? versionCode + 1 : undefined

    console.log(newVersionName)
    console.log(newVersionCode)

    const newVersion = {
      versionName: newVersionName,
      versionCode: newVersionCode
    }

    const message = versionCode
      ? `Bump version name to ${newVersionName} and version code to ${newVersionCode}\n[skip ci]`
      : `Bump version name to ${newVersionName}\n[skip ci]`

    await commitVersionBump(versionPath, JSON.stringify(newVersion), message)
  } catch (e) {
    console.error(e)
  }
}

const commitVersionBump = async (path, content, message) => {
  const privateKey = process.env.DELIVERINO_PRIVATE_KEY
  const owner = process.env.CIRCLE_PROJECT_USERNAME
  const repo = process.env.CIRCLE_PROJECT_REPONAME
  const branch = process.env.CIRCLE_BRANCH

  console.log('commit')

  const appOctokit = new Octokit({
    authStrategy: createAppAuth,
    auth: {
      id: 59249,
      privateKey
    }
  })
  console.log('appOctokit')

  const installation = await appOctokit.apps.getRepoInstallation({
    owner,
    repo
  })
  console.log('installation')

  const { token } = await appOctokit.auth({
    type: "installation",
    installationId: installation.id
  })
  console.log('token')

  const octokit = new Octokit({
    auth: token
  })
  console.log('octokit')

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
