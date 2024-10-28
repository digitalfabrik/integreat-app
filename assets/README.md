# Assets

All build-config and platform independent assets should be placed in this directory.
All assets should use kebab-case naming.

## Icons

### Conventions

Icons should be added to the corresponding [icons](icons) subfolder.
Normal icons are supposed to follow the following conventions:

- Use the SVG format
- Resize to 24x24px with width and height set
- The viewbox starts at (0, 0)
- Set the general icon color to `currentColor` (using `fill="currentColor"`)
- The SVG should be as simple and reduced as possible

If the icon has e.g. a build-config dependent background, you can use `fill="var(--theme-color, none)"`.

### Usage

To use icons (and other assets) in the code, add them to the corresponding assets files
for [web](../web/src/assets/index.ts) and/or [native](../native/src/assets/index.ts).
You can then simply use our custom `Icon`
components ([web](../web/src/components/base/Icon.tsx), [native](../native/src/components/base/Icon.tsx)).
They automatically set the default color, theme color and size and provide additional convenience props
(e.g. `directionDependent`, `reverse`).
If necessary, you can simply override styles using styled-components.
