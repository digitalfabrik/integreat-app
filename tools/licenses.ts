#!/usr/bin/env tsx
// Generates src/assets/licenses.json for Yarn v4 workspaces where web deps are hoisted to root.
// license-checker-rseidelsohn --production is broken in this setup because it relies on local node_modules.
import { program } from 'commander'
import fs from 'node:fs'
import path from 'node:path'

type PackageJson = {
  name?: string
  version?: string
  private?: boolean
  license?: string
  dependencies?: Record<string, string>
  repository?: string | { url: string }
  author?: string | { name: string }
}

type LicenseEntry = {
  licenses: string
  repository?: string
  publisher?: string
}

const readPackageJson = (pkgDir: string): PackageJson | null => {
  try {
    return JSON.parse(fs.readFileSync(path.join(pkgDir, 'package.json'), 'utf8')) as PackageJson
  } catch {
    return null
  }
}

const collectDependencies = (pkgName: string, pkgDir: string, dependencies: Set<string>): Set<string> => {
  if (dependencies.has(pkgName)) {
    return dependencies
  }
  dependencies.add(pkgName)

  const pkg = readPackageJson(path.join(pkgDir, pkgName))
  if (!pkg) {
    return dependencies
  }

  Object.keys(pkg.dependencies ?? {}).forEach(dependency => collectDependencies(dependency, pkgDir, dependencies))
  return dependencies
}

type LicensesOptions = {
  nodeModules: string
}

export default program
  .description('Generate the licenses for the current workspace')
  .option('--node-modules <node-modules>', 'The directory of the node_modules relative to the workspace', '.')
  .action(async ({ nodeModules }: LicensesOptions) => {
    const workspaceDir = process.cwd()
    const nodeModulesDir = path.join(workspaceDir, nodeModules, 'node_modules')
    const outFile = path.join(workspaceDir, 'src/assets/licenses.json')

    const workspacePackage = readPackageJson(workspaceDir)
    if (!workspacePackage) {
      throw new Error('Workspace package.json not found!')
    }

    const dependencies = new Set<string>()
    Object.keys(workspacePackage.dependencies ?? {}).forEach(dependency =>
      collectDependencies(dependency, nodeModulesDir, dependencies),
    )

    if (dependencies.size === 0) {
      throw new Error('No dependencies found for workspace!')
    }

    const licenses = Array.from(dependencies)
      .sort()
      .reduce<Record<string, LicenseEntry>>((licenses, pkgName) => {
        const pkg = readPackageJson(path.join(nodeModulesDir, pkgName))
        if (!pkg || pkg.private) {
          return licenses
        }

        const key = `${pkg.name}@${pkg.version}`

        const repo = typeof pkg.repository === 'string' ? pkg.repository : pkg.repository?.url
        // Convert git to https urls
        const repoUrl = repo
          ?.replace(/^git\+/, '')
          .replace(/\.git$/, '')
          .replace(/^git:\/\//, 'https://')

        const rawAuthor = typeof pkg.author === 'string' ? pkg.author : pkg.author?.name
        // Replace email addresses and websites in author
        const author = rawAuthor
          ?.replace(/<.*>/g, '')
          .replace(/\(.*\)/g, '')
          .trim()

        licenses[key] = {
          licenses: pkg.license ?? 'UNKNOWN',
          repository: repoUrl,
          publisher: author,
        }
        return licenses
      }, {})

    fs.writeFileSync(outFile, JSON.stringify(licenses, null, 2))
    console.log(`Wrote ${Object.keys(licenses).length} licenses to ${outFile}`)
  })
program.parse(process.argv)
