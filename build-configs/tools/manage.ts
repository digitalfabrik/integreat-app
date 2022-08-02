import { program } from 'commander'
import decamelize from 'decamelize'
import flat from 'flat'
import fs from 'fs'

import loadBuildConfig, { PlatformType } from '../index'

const loadBuildConfigAsKeyValue = (buildConfigName: string, platform: PlatformType, spaces = true, quotes = false) => {
  const buildConfig = loadBuildConfig(buildConfigName, platform)!
  const xcconfigOptions = flat<Record<string, unknown>, Record<string, string | number | boolean>>(buildConfig, {
    delimiter: '_',
    // Dashes are not supported in keys in xcconfigs and android resources
    transformKey: key => decamelize(key).toUpperCase().replace('-', '_'),
  })
  const assignOperator = `${spaces ? ' ' : ''}=${spaces ? ' ' : ''}`

  const quoteValue = (value: string) => (quotes ? `"${value.replace(/"/g, '\\"')}"` : value)

  const prefixed = Object.keys(xcconfigOptions).map(key => {
    const value = String(xcconfigOptions[key]).replace(/\n/g, '\\n')
    const escaped = spaces ? value : value.replace(/\s/g, '_')
    return `BUILD_CONFIG_${key}${assignOperator}${quoteValue(escaped)}`
  })
  prefixed.push(`BUILD_CONFIG_NAME${assignOperator}${quoteValue(buildConfigName)}`)
  return prefixed.join('\n')
}

program
  .command('write-xcconfig <build_config_name> <platform>')
  .requiredOption('--directory <directory>', 'the directory to put the created xcconfig file in')
  .description('create and write a new buildConfig.tmp.xcconfig to the output directory')
  .action((buildConfigName: string, platform: PlatformType, options: { directory: string }) => {
    try {
      const xcconfig = loadBuildConfigAsKeyValue(buildConfigName, platform)
      fs.writeFileSync(`${options.directory}/buildConfig.tmp.xcconfig`, xcconfig)
    } catch (e) {
      console.error(e)
      process.exit(1)
    }
  })
program
  .command('to-properties <build_config_name> <platform>')
  .description('create and write a new properties file to the stdout')
  .action((buildConfigName, platform) => {
    try {
      const properties = loadBuildConfigAsKeyValue(buildConfigName, platform)
      console.log(properties)
    } catch (e) {
      console.error(e)
      process.exit(1)
    }
  })
program
  .command('to-bash <build_config_name> <platform>')
  .description('outputs the specified build config as key-value pairs which can be executed by bash')
  .action((buildConfigName, platform) => {
    const buildConfig = loadBuildConfigAsKeyValue(buildConfigName, platform, false, true)
    console.log(buildConfig)
  })
program
  .command('to-json <build_config_name> <platform>')
  .description('outputs the specified build config as JSON')
  .action((buildConfigName, platform) => {
    const buildConfig = loadBuildConfig(buildConfigName, platform)
    console.log(JSON.stringify(buildConfig))
  })
program.parse(process.argv)
