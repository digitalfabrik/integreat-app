# Build Configuration and Automation Scripts

```bash
├── build.js                    # Compiles the app from source code
├── config.js                   # General application settings
├── lib.build.js                # Compiles the library from /src/lib.js to /dist
├── lib.webpack.config.js       # Bundling and optimization config for the shared library
├── postcss.config.js           # PostCSS settings for compiling CSS files
├── run.js                      # Compiles the app in watch mode and runs dev server
├── task.js                     # A custom minimalistic script/task runner
└── webpack.config.js           # Bundling and optimization settings
```


### [`build.js`](./build.js) — compilation

```bash
node tools/build                # Compiles the app for production
node tools/build --debug        # Compiles the app in debug (non-optimized) mode
```

### [`lib.build.js.js`](./lib.build.js) — compilation of library

```bash
node tools/run                  # Compiles the library and emits the library along with a 'package.json' in dist.
```

### [`run.js`](./run.js) — launching for testing/debugging

```bash
node tools/run                  # Compiles the app and opens it in a browser with "live reload"
