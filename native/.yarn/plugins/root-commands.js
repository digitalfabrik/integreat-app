module.exports = {
  name: `root-commands`,
  factory: async require => {
    const { Configuration, Project, Manifest, scriptUtils } = require('@yarnpkg/core')
    const { ppath, Filename, toFilename, xfs } = require('@yarnpkg/fslib')

    const currentProjectRoot = await Configuration.findProjectCwd(ppath.cwd(), Filename.lockfile)
    const manifest = await Manifest.find(currentProjectRoot)
    const currentCommand = process.argv[2]

    // don't ovewrite existing commands in the current manifest
    if (manifest.scripts.get(currentCommand)) {
      return {} 
    }

    const ROOT = ppath.join(`${currentProjectRoot}/..`)
    const rootManifest = await Manifest.find(ROOT)
    // don't copy root binaries
    if (!rootManifest.scripts.get(currentCommand)) {
      return {}
    }

    // The actual Plugin begins here
    const buildCommand = commandName => {
      const { Cli, Option } = require('clipanion')
      const { BaseCommand, getPluginConfiguration } = require(`@yarnpkg/cli`)
      const { execute } = require('@yarnpkg/shell')

      class RootCommand extends BaseCommand {
        args = Option.Proxy();
        static paths = [[commandName]]

    // The following functions are mostly copy pasted from
    // https://github.com/yarnpkg/berry/blob/%40yarnpkg/shell/3.2.5/packages/yarnpkg-core/sources/scriptUtils.ts

    async makePathWrapper(location, name, argv0, args = []) {
      if (process.platform === `win32`) {
        // https://github.com/microsoft/terminal/issues/217#issuecomment-737594785
        const cmdScript = `@goto #_undefined_# 2>NUL || @title %COMSPEC% & @setlocal & @"${argv0}" ${args
          .map(arg => `"${arg.replace(`"`, `""`)}"`)
          .join(` `)} %*`
        await xfs.writeFilePromise(ppath.format({ dir: location, name, ext: `.cmd` }), cmdScript)
      }

      await xfs.writeFilePromise(
        ppath.join(location, name),
        `#!/bin/sh\nexec "${argv0}" ${args.map(arg => `'${arg.replace(/'/g, `'"'"'`)}'`).join(` `)} "$@"\n`,
        {
          mode: 0o755,
        },
      )
    }

    async installBinaries(target, binaries) {
      await Promise.all(
        Array.from(binaries, ([binaryName, [, binaryPath, isScript]]) => {
          return isScript
            ? this.makePathWrapper(target, toFilename(binaryName), process.execPath, [binaryPath])
            : this.makePathWrapper(target, toFilename(binaryName), binaryPath, [])
        }),
      )
    }

    async initializeWorkspaceEnvironment(workspace, { binFolder, cwd, lifecycleScript }) {
      const env = await scriptUtils.makeScriptEnv({
        project: workspace.project,
        locator: workspace.anchoredLocator,
        binFolder,
        lifecycleScript,
      })
      env.INIT_CWD = cwd // <- this sets the cwd for the command to the project directory
      await this.installBinaries(
        binFolder,
        await scriptUtils.getPackageAccessibleBinaries(workspace.anchoredLocator, { project: workspace.project }),
      )
      return { manifest: workspace.manifest, binFolder, env, cwd }
    }

        async execute() {
          const pluginConfiguration = getPluginConfiguration()
          const configuration = await Configuration.find(ROOT, pluginConfiguration, {
            strict: true,
          })
          const { project } = await Project.find(configuration, ROOT)

          await project.restoreInstallState()

          try {
            return await xfs.mktempPromise(async binFolder => {
              const { manifest, env } = await this.initializeWorkspaceEnvironment(project.topLevelWorkspace, {
                binFolder,
                cwd: this.context.cwd,
                lifecycleScript: commandName,
              })

              const script = manifest.scripts.get(commandName)
              if (typeof script === `undefined`) return 1

              const realExecutor = async () => {
                return await execute(script, this.args, {
                  cwd: this.context.cwd,
                  env: env,
                  stdin: process.stdin,
                  stdout: process.stdout,
                  stderr: process.stderr,
                })
              }

              const executor = await project.configuration.reduceHook(
                hooks => {
                  return hooks.wrapScriptExecution
                },
                realExecutor,
                project,
                project.topLevelWorkspace.anchoredLocator,
                commandName,
                {
                  script,
                  args: this.args,
                  cwd: this.context.cwd,
                  env: env,
                  stdin: process.stdin,
                  stdout: process.stdout,
                  stderr: process.stderr,
                },
              )
              return await executor()
            })
          } catch (error) {
            Cli.defaultContext.stdout.write(error.stack || error.message)
            process.exitCode = 1
          } finally {
            await xfs.rmtempPromise()
          }
        }
      }
      return RootCommand
    }

    return {
      commands: [buildCommand(currentCommand)]
    }
  },
}
