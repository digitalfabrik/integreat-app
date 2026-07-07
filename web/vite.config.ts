import react from '@vitejs/plugin-react'
import ejs from 'ejs'
import { execFile } from 'node:child_process'
import { cpSync, createReadStream, existsSync, statSync } from 'node:fs'
import { dirname as pathDirname, extname, join, resolve } from 'node:path'
import { env } from 'node:process'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'
import { defineConfig, type Plugin, type UserConfig } from 'vite'
import generateFile, { type GenerateFile } from 'vite-plugin-generate-file'

import loadBuildConfig, { WEB } from 'build-configs'
import type { WebBuildConfigType } from 'build-configs/BuildConfigType'

import versionJson from '../version.json'

const execFileAsync = promisify(execFile)
const dirname = pathDirname(fileURLToPath(import.meta.url))

const MiB = 2 ** 20
const MAX_BUNDLE_SIZE = 2.1 * MiB

type ViteMode = 'development' | 'production'

export default defineConfig(async configEnv => {
  const buildConfigName = env.CONFIG_NAME
  if (!buildConfigName) {
    throw new Error('Please specify a build config name via the CONFIG_NAME env var')
  }

  const buildConfig = loadBuildConfig(buildConfigName, WEB)
  const mode = configEnv.mode as ViteMode

  const versionName = readVersionName(mode)
  const shortCommitSha = await currentCommitHash()

  console.log(`vite.config.ts: config name=${buildConfigName}`)

  const configAssetsDir = resolve(dirname, '..', 'build-configs', 'src', buildConfigName, 'assets')

  console.log(`vite.config.ts: config assets dir=${configAssetsDir}`)
  console.log(`vite.config.ts: version name=${versionName}`)
  console.log(`vite.config.ts: commit sha=${shortCommitSha}`)

  return {
    appType: 'spa',
    root: dirname,
    publicDir: resolve(dirname, 'www'),
    plugins: [
      react(),
      indexHtmlPlugin(buildConfig),
      buildConfigAssetsPlugin(configAssetsDir),
      generateFile([
        templateManifest(buildConfig, versionName),
        ...templateAssetLinks(buildConfig),
        ...templateAppleAppSiteAssociations(buildConfig),
      ]),
    ],
    build: {
      outDir: join('build', buildConfigName),
      emptyOutDir: true,
      // TODO Do we really need source maps in the final build? Sentry can upload these.
      sourcemap: true,
      assetsInlineLimit: 10000,
      chunkSizeWarningLimit: MAX_BUNDLE_SIZE / 1024,
      rolldownOptions: {
        output: {
          minify: {
            compress: {
              dropConsole: true,
              dropDebugger: true,
            },
          },
        },
      },
    },
    define: {
      __VERSION_NAME__: JSON.stringify(versionName),
      __COMMIT_SHA__: JSON.stringify(shortCommitSha),
      __BUILD_CONFIG_NAME__: JSON.stringify(buildConfigName),
      __BUILD_CONFIG__: JSON.stringify(buildConfig),
    },
    preview: {
      open: true,
      port: 9001,
    },
    server: {
      port: 9001,
      host: true,
    },
  } satisfies UserConfig
})

/** Render the index.html from the ejs template */
function indexHtmlPlugin(buildConfig: WebBuildConfigType): Plugin {
  return {
    name: 'integreat:index-html',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        return ejs.render(html, { config: buildConfig })
      },
    },
  }
}

/** Serve build-configs asset files */
function buildConfigAssetsPlugin(assetsDir: string): Plugin {
  let outDir: string

  return {
    name: 'integreat:build-config-assets',
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir)
    },
    configureServer(server) {
      server.middlewares.use((request, result, next) => {
        if (!request.url) {
          return next()
        }

        const requested = decodeURIComponent(request.url.split('?')[0] ?? '')
        const filePath = join(assetsDir, requested)

        if (!existsSync(filePath) || !statSync(filePath).isFile()) {
          return next()
        } else {
          result.setHeader('Content-Type', mimeTypeFor(filePath))
          createReadStream(filePath).pipe(result)
          return undefined
        }
      })
    },
    closeBundle() {
      if (existsSync(assetsDir)) {
        cpSync(assetsDir, outDir, { recursive: true, dereference: true })
      }
    },
  }
}

function templateManifest(buildConfig: WebBuildConfigType, versionName: string): GenerateFile {
  return {
    type: 'json',
    output: 'manifest.json',
    data: {
      manifest_version: 2,
      name: buildConfig.appName,
      short_name: buildConfig.appName,
      version: versionName,
      description: buildConfig.appDescription,
      homepage_url: buildConfig.aboutUrls.default,
      theme_color: buildConfig.lightTheme.palette.secondary.main,
      prefer_related_applications: true,
      start_url: '/',
      display: 'standalone',
      background_color: '#ffffff',
      icons: [
        {
          src: 'favicons/favicon-16x16.png',
          sizes: '16x16',
        },
        {
          src: 'favicons/favicon-48x48.png',
          sizes: '48x48',
        },
        {
          src: 'favicons/favicon-96x96.png',
          sizes: '96x96',
        },
        {
          src: 'favicons/favicon-192x192.png',
          sizes: '192x192',
        },
        {
          src: 'favicons/favicon-512x512.png',
          sizes: '512x512',
        },
      ],
      related_applications: buildConfig.apps
        ? [
            {
              platform: 'play',
              id: buildConfig.apps.android.applicationId,
              url: `https://play.google.com/store/apps/details?id=${buildConfig.apps.android.applicationId}`,
            },
            {
              platform: 'itunes',
              url: `https://apps.apple.com/de/app/${buildConfig.apps.ios.appStoreName}/id${buildConfig.apps.ios.appStoreId}`,
            },
          ]
        : undefined,
    },
  }
}

function templateAssetLinks(buildConfig: WebBuildConfigType): GenerateFile[] {
  return buildConfig.apps
    ? [
        {
          type: 'json',
          output: '.well-known/assetlinks.json',
          // https://developer.android.com/training/app-links/verify-site-associations#manual-verification
          data: [
            {
              relation: ['delegate_permission/common.handle_all_urls'],
              target: {
                namespace: 'android_app',
                package_name: buildConfig.apps.android.applicationId,
                sha256_cert_fingerprints: [buildConfig.apps.android.sha256CertFingerprint],
              },
            },
            ...buildConfig.allowedLookalikes.map(site => ({
              relation: ['lookalikes/allowlist'],
              target: { namespace: 'web', site },
            })),
          ],
        },
      ]
    : []
}

function templateAppleAppSiteAssociations(buildConfig: WebBuildConfigType): GenerateFile[] {
  return buildConfig.apps
    ? [
        {
          type: 'json',
          output: '.well-known/apple-app-site-association',
          contentType: 'application/json',
          data: {
            applinks: {
              apps: [],
              details: [
                {
                  appIDs: buildConfig.apps.ios.appleAppSiteAssociationAppIds,
                  paths: ['*', '/'],
                },
              ],
            },
          },
        },
      ]
    : []
}

function readVersionName(mode: ViteMode): string {
  if (mode === 'development') {
    return 'development'
  } else if (env.NEW_VERSION_NAME) {
    console.log(`vite.config.ts: using 'NEW_VERSION_NAME' env var`)
    return env.NEW_VERSION_NAME
  } else {
    console.log(`vite.config.ts: using 'version.json'`)
    return versionJson.versionName
  }
}

async function currentCommitHash(): Promise<string> {
  const { stdout } = await execFileAsync('git', ['log', '-n1', '--format=%h'], {
    cwd: resolve(dirname, '..'),
    encoding: 'utf8',
  })
  return stdout.trim()
}

function mimeTypeFor(filePath: string): string {
  return (
    {
      '.css': 'text/css',
      '.gif': 'image/gif',
      '.html': 'text/html',
      '.ico': 'image/x-icon',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.js': 'application/javascript',
      '.json': 'application/json',
      '.png': 'image/png',
      '.svg': 'image/svg+xml',
      '.ttf': 'font/ttf',
      '.txt': 'text/plain',
      '.webp': 'image/webp',
      '.woff': 'font/woff',
      '.woff2': 'font/woff2',
      '.xml': 'application/xml',
    }[extname(filePath).toLowerCase()] ?? 'application/octet-stream'
  )
}
