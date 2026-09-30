# Vendored Tabler Icons webfont (v3.46.0)

These files are `dist/tabler-icons.min.css` + the base font files from the
`@tabler/icons-webfont` npm package, copied into the repo so the package
itself is NOT a dependency.

Why: `@tabler/icons-webfont` ships its SVG->font build toolchain
(`svgtofont` -> cheerio/undici, svg2ttf/@xmldom/xmldom, svgo,
ttf2woff2/node-gyp/http-cache-semantics) as runtime npm dependencies.
That subtree carries 18 Snyk findings — including http-cache-semantics,
which has NO fixed version — even though the app only ever uses this CSS
and these fonts. Vendoring the finished assets removes the whole
vulnerable dependency tree from package-lock.json.

IMPORTANT: do not re-add "@tabler/icons-webfont" to package.json — that
reintroduces all 18 vulnerabilities. To upgrade icons later:
  npm pack @tabler/icons-webfont@<version>
  tar -xzf tabler-icons-webfont-*.tgz
  cp package/dist/tabler-icons.min.css        src/vendor/tabler-icons/
  cp package/dist/fonts/tabler-icons.{woff2,woff,ttf} src/vendor/tabler-icons/fonts/
