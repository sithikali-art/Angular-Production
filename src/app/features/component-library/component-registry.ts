import { Type } from '@angular/core';

import { GENERATED_COMPONENT_LIBRARY } from './component-registry.generated';
import { COMPONENT_PREVIEWS } from './component-previews';

/** One showcased component: generated entry merged with optional preview. */
export interface LibraryEntry {
  /** Folder name under shared/components — also the detail-page URL id. */
  id: string;
  component: Type<unknown>;
  description: string;
  sampleInputs?: Record<string, unknown>;
  example: string;
  /** Full-screen overlays get an interactive demo instead of auto-render. */
  overlay?: boolean;
  /** How the preview area renders: the real component, an interactive
   *  overlay demo, or a "needs sample inputs" placeholder (required
   *  inputs with no sampleInputs would throw NG0950 if rendered). */
  previewMode: 'live' | 'overlay' | 'needs-inputs';
}

/** Selector / inputs / outputs read from the compiled component definition. */
export interface ComponentMeta {
  selector: string;
  inputs: string[];
  outputs: string[];
}

/**
 * Runtime reflection over Angular's component definition — selectors and
 * input/output lists are never hand-maintained, so they always match the
 * source.
 */
export function componentMeta(component: Type<unknown>): ComponentMeta {
  const def = (component as unknown as { ɵcmp?: Record<string, unknown> }).ɵcmp;
  const selectors = (def?.['selectors'] as string[][] | undefined) ?? [];
  return {
    selector: String(selectors[0]?.[0] ?? ''),
    inputs: Object.keys((def?.['inputs'] as object | undefined) ?? {}),
    outputs: Object.keys((def?.['outputs'] as object | undefined) ?? {}),
  };
}

/** 'wallet-balance-card' -> 'Wallet Balance Card' */
export function displayName(id: string): string {
  return id
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

/**
 * The library: every component folder under shared/components (discovered
 * at build time by tools/generate-component-library.mjs) merged with any
 * optional preview settings from component-previews.ts. Creating a new
 * shared component requires NO change here.
 */
export const COMPONENT_LIBRARY: LibraryEntry[] = GENERATED_COMPONENT_LIBRARY.map((entry) => {
  const preview = COMPONENT_PREVIEWS[entry.id] ?? {};
  const previewMode = preview.overlay
    ? ('overlay' as const)
    : entry.requiredInputs && !preview.sampleInputs
      ? ('needs-inputs' as const)
      : ('live' as const);
  return {
    ...entry,
    ...preview,
    previewMode,
    example: preview.example ?? `<${componentMeta(entry.component).selector} />`,
  };
});
