import { program } from 'commander'
import fetch from 'node-fetch'

import { MAIN_BRANCH } from './constants'

const CIRCLECI_URL = 'https://circleci.com/api/v2/project/github/digitalfabrik/integreat-app/pipeline'
const WORKFLOW_TYPES = [
  'none',
  'native_beta_delivery',
  'native_production_delivery',
  'native_promotion',
  'web_beta_delivery',
  'web_production_delivery',
  'web_promotion',
  'delivery'
]

program.requiredOption('--api-token <api-token>', 'circleci api token')

program
  .command('trigger <workflow-type>')
  .description(`trigger a workflow in the ci on the main branch`)
  .action(async (workflowType: string, program: { apiToken: string }) => {
    try {
      if (!WORKFLOW_TYPES.includes(workflowType)) {
        throw new Error(`Only the following workflow types are supported: ${WORKFLOW_TYPES}`)
      }

      const postData = {
        branch: MAIN_BRANCH,
        parameters: {
          api_triggered: true,
          workflow_type: workflowType
        }
      }

      const response = await fetch(CIRCLECI_URL, {
        method: 'POST',
        body: JSON.stringify(postData),
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'Circle-Token': program.apiToken
        }
      })
      const json = await response.json()
      console.log(json)
    } catch (e) {
      console.error(e)
      process.exit(1)
    }
  })

program.parse(process.argv)
