const build = require('./build')
const task = require('./task')
const http = require('http')
const createHandler = require('github-webhook-handler')
const simpleGit = require('simple-git')()
const {execSync} = require('child_process')

module.exports = task('build-webhook',
  () => {
    const config = {path: '/webhook', secret: ''}
    const branchRef = process.argv[2]
    config.secret = process.argv[3] || ''

    return Promise.resolve()
      .then(() => {
        const handler = createHandler(config)

        console.log('Webhook server started.')
        console.log(`Branch ref is '${branchRef}'`)
        console.log(`Path is '${config.path}'`)
        console.log(`Secret is: '${config.secret}'`)
        http.createServer((req, res) => {
          handler(req, res, () => {
            res.statusCode = 404
            res.end('no such location')
          })
        }).listen(7777)

        handler.on('error', function (err) {
          console.error('Error:', err.message)
        })

        handler.on('push', event => {
          if (event.payload.ref !== branchRef) {
            return
          }
          console.log('Received a push event for %s to %s', event.payload.repository.name, event.payload.ref)
          simpleGit.fetch(() => console.log('Fetched from remote'))
          simpleGit.stash(['save', 'Reason: webhook'], () => console.log('Stashed changes'))
          simpleGit.reset('hard', [event.payload.after], () => console.log(`Reset to ${event.payload.after}`))
          console.log('Update dependencies...')
          execSync('yarn', {stdio: [0, 1, 2]})
          console.log('Building...')
          build()
        })
      })
  }
)
