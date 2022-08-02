import { program } from 'commander'
import JiraApi from 'jira-client'

const JIRA_HOST = 'issues.tuerantuer.org'

type JiraVersion = {
  name: string
  releaseDate: string
  id: string
}

type JiraIssue = {
  id: string
}

program
  .option('-d, --debug', 'enable extreme logging')
  .requiredOption('--project-name <project-name>', 'the name of the jira project, e.g. integreat-app')
  .requiredOption('--access-token <access-token>', 'version name of the new release')
  .requiredOption('--private-key <privateKey>')
  .requiredOption('--consumer-key <consumer-key>')

type Opts = {
  accessToken: string
  privateKeyBase64: string
  consumerKey: string
  projectName: string
}

type Options = Opts & {
  newVersionName: string
}

const createRelease = async ({ newVersionName, accessToken, privateKeyBase64, consumerKey, projectName }: Options) => {
  const privateKey = Buffer.from(privateKeyBase64, 'base64').toString('ascii')
  const jiraApi = new JiraApi({
    protocol: 'https',
    host: JIRA_HOST,
    apiVersion: '2',
    strictSSL: true,
    oauth: {
      consumer_key: consumerKey,
      consumer_secret: privateKey,
      access_token: accessToken,
      access_token_secret: '',
    },
  })

  const date = new Date()
  const newReleaseDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`

  const projects = await jiraApi.listProjects()
  const project = projects.find(project => project.name === projectName)

  if (!project) {
    throw new Error(`The project ${projectName} does not exist!`)
  }

  const projectKey = project.key

  await jiraApi.createVersion({
    name: newVersionName,
    released: true,
    releaseDate: newReleaseDate,
    project: projectKey,
  })

  const unsortedVersions = (await jiraApi.getVersions(projectKey)) as JiraVersion[]
  const versions = unsortedVersions.sort((a, b) => b.releaseDate.localeCompare(a.releaseDate))

  const newVersion = versions.find(version => version.name === newVersionName)
  const lastVersion = versions.find(version => version.name !== newVersionName)

  if (!newVersion) {
    throw new Error('Failed to create new version!')
  }

  if (newVersion.name !== newVersionName) {
    throw Error(`There is already a release ${newVersion.name} with a later release date in the project!`)
  }

  const lastDate = lastVersion ? lastVersion.releaseDate : '1970-01-01'
  // Get all issues which should be part of the new release
  const query = `project = ${projectName} AND fixVersion IS EMPTY AND resolution = Done AND resolutiondate >= ${lastDate}`
  // If 'maxResults' is bigger than 'jira.search.views.default.max', the results are truncated.
  // https://docs.atlassian.com/software/jira/docs/api/REST/8.9.0/#api/2/search-search
  // https://issues.tuerantuer.org/secure/admin/ViewSystemInfo.jspa
  const response = await jiraApi.searchJira(query, {
    fields: ['id'],
    maxResults: 1000,
  })
  const issues = response.issues as JiraIssue[]

  // Set fixVersion for all issues
  await Promise.all(
    issues.map(issue => {
      const issueId = issue.id

      const issueUpdate = {
        update: {
          fixVersions: [
            {
              set: [
                {
                  id: newVersion.id,
                },
              ],
            },
          ],
        },
      }
      return jiraApi.updateIssue(issueId, issueUpdate, { notifyUsers: false })
    })
  )
}

program
  .command('create <new-version-name>')
  .description(
    'create a new release with the name <new-version-name> on jira and assign all issues resolved since the last release'
  )
  .action(async (newVersionName: string, options: Opts) => {
    try {
      await createRelease({
        newVersionName,
        ...options,
      })
    } catch (e) {
      console.error(e)
      process.exit(1)
    }
  })

program.parse(process.argv)
