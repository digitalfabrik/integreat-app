/*
 * Minimalistic script runner. Usage example:
 *
 *     node tools/deploy.js
 *     Starting 'deploy'...
 *     Starting 'build'...
 *     Finished 'build' in 3212ms
 *     Finished 'deploy' in 582ms
 */

function run (task, action, ...args) {
  const command = process.argv[2]
  const taskName = command && !command.startsWith('-') ? `${task}:${command}` : task
  const newArgs = args.length === 0
    ? process.argv.slice(2).filter(arg => !arg.startsWith('-'))
    : args
  const start = new Date()
  process.stdout.write(`Starting '${taskName}'...\n`)
  return Promise.resolve().then(() => action(...newArgs)).then(result => {
    process.stdout.write(`Finished '${taskName}' after ${new Date().getTime() - start.getTime()}ms\n`)
    return Promise.resolve(result)
  }, err => {
    process.stderr.write(`${err.stack}\n`)
    process.exit(1)
  })
}

process.nextTick(() => require.main.exports())

module.exports = (task, action) => run.bind(undefined, task, action)
