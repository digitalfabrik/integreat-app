const build = require('./build')
const task = require('./task')
const http = require('http')
const createHandler = require('github-webhook-handler')
const simpleGit = require('simple-git')()
const { exec } = require('child_process')

module.exports = task('build-webhook',
  () => Promise.resolve()
    .then(() => {
      const handler = createHandler({path: '/webhook', secret: 'myhashsecret'})

      process.stdout.write(`Starting webhook server'...\n`)
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
        if (event.payload.ref !== 'refs/heads/WEBAPP-105') {
          return
        }
        console.log('Received a push event for %s to %s', event.payload.repository.name, event.payload.ref)
        simpleGit.fetch(() => console.log('Fetched from remote'))
        simpleGit.stash(['save', 'Reason: webhook'], () => console.log('Stashed changes'))
        simpleGit.reset('hard', [event.payload.after], () => console.log(`Reset to ${event.payload.ref}`))
        console.log('Update dependencies...')
        exec('yarn')
        console.log('Building...')
        build()
      })
    })
)
