#!/usr/bin/env node
/**
 * Dev entry point used by `npm start`:
 *   1. watches src/app/shared/components and regenerates the Component
 *      Library registry whenever a component is added, renamed, changed
 *      or removed — so new shared components show up on
 *      /component-library live, without restarting the server;
 *   2. runs `ng serve` (all extra `npm start -- <args>` are passed on).
 *
 * Works on Windows, macOS and Linux (recursive fs.watch + node spawn).
 */
import { watch } from 'node:fs';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { generate } from './generate-component-library.mjs';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const componentsDir = join(projectRoot, 'src/app/shared/components');

/* --- 1. watch shared/components, regenerate (debounced) --- */
let timer = null;
watch(componentsDir, { recursive: true }, (_event, filename) => {
  if (filename && !String(filename).includes('.component.')) {
    // folder-level events have no extension — still regenerate for those
    if (String(filename).includes('.')) {
      return;
    }
  }
  clearTimeout(timer);
  timer = setTimeout(() => {
    try {
      const { count, changed } = generate();
      if (changed) {
        console.log(`[component-library] registry regenerated (${count} components)`);
      }
    } catch (err) {
      console.error('[component-library] generation failed:', err.message);
    }
  }, 250);
});
console.log('[component-library] watching src/app/shared/components for new components…');

/* --- 2. run ng serve --- */
const require = createRequire(import.meta.url);
const ngBin = require.resolve('@angular/cli/bin/ng.js', { paths: [projectRoot] });
const child = spawn(process.execPath, [ngBin, 'serve', ...process.argv.slice(2)], {
  cwd: projectRoot,
  stdio: 'inherit',
});
child.on('exit', (code) => process.exit(code ?? 0));
