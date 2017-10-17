# Build Configuration and Automation Scripts

```bash
├── build.js                    # Compiles the app from source code
├── config.js                   # General application settings
├── postcss.config.js           # PostCSS settings for compiling CSS files
├── publish.js                  # Builds and deploys the app
├── run.js                      # Compiles the app in watch mode and runs dev server
├── task.js                     # A custom minimalistic script/task runner
└── webpack.config.js           # Bundling and optimization settings
```


### [`build.js`](./build.js) — compilation

```bash
node tools/build                # Compiles the app for production
node tools/build --debug        # Compiles the app in debug (non-optimized) mode
```


### [`run.js`](./run.js) — launching for testing/debugging

```bash
node tools/run                  # Compiles the app and opens it in a browser with "live reload"
```


### [`publish.js`](./publish.js) — deployment

```bash
node tools/publish.js           # Compiles the app and deployes
```
