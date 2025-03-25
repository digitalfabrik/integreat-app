import { program } from 'commander'
import fetch from 'node-fetch'

import { MAIN_BRANCH } from './constants.js'

const CIRCLECI_URL = 'https://circleci.com/api/v2/project/github/digitalfabrik/integreat-app/pipeline'
const WORKFLOW_TYPES = [
  'none',
  'native_beta_delivery',
  'native_production_delivery',
  'native_promotion',
  'web_beta_delivery',
  'web_production_delivery',
  'web_promotion',
  'delivery',
  'promotion',
  'e2e_tests',
  'native_browserstack',
]

program
  .command('trigger <workflow-type>')
  .description(`trigger a workflow in the ci on the main branch`)
  .requiredOption('--api-token <api-token>', 'circleci api token')
  .option('--branch <branch>', 'the branch the workflow will be triggered on', MAIN_BRANCH)
  .action(async (workflowType: string, options: { apiToken: string; branch: string }) => {
    const { apiToken, branch } = options

    try {
      if (!WORKFLOW_TYPES.includes(workflowType)) {
        throw new Error(`Only the following workflow types are supported: ${WORKFLOW_TYPES}`)
      }

      const postData = {
        branch,
        parameters: {
          api_triggered: true,
          workflow_type: workflowType,
        },
      }

      const response = await fetch(CIRCLECI_URL, {
        method: 'POST',
        body: JSON.stringify(postData),
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'Circle-Token': apiToken,
        },
      })
      const json = await response.json()
      console.log(json)
    } catch (e) {
      console.error(e)
      process.exit(1)
    }
  })

program.parse(process.argv)
