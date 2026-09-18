# Xtrm — Fintech SaaS Dashboard (Angular 22)

Pixel-faithful Angular 22 implementation of the Xtrm fintech dashboard mockups:
standalone components, signals everywhere, **zoneless** change detection, modern
`@if / @for` control flow, lazy-loaded routes and SCSS design tokens with five
switchable palettes + dark mode.

## Run it

```bash
npm install
npm start          # http://localhost:4200
npm run build      # production bundle in dist/
```

> Requires Node.js ^22.22.3 or ^24. All data is served from local mocks
> (`USE_MOCK_API` token), so the app runs fully standalone. Point
> `API_BASE_URL` at the real C# .NET Core API and flip `USE_MOCK_API` to
> `false` to go live.

## Folder architecture

```
src/app/
├── core/                            # Singleton services, no UI
│   ├── api/                         # Typed HttpClient gateways to the .NET API
│   │   ├── api-config.ts            #   API_BASE_URL + USE_MOCK_API injection tokens
│   │   ├── wallet-api.service.ts    #   GET wallets / transactions / activity / funding accounts
│   │   ├── approvals-api.service.ts #   GET pending, POST approve/decline
│   │   └── payments-api.service.ts  #   GET drafts, DELETE draft
│   ├── interceptors/
│   │   ├── auth.interceptor.ts      #   Bearer token (Azure AD / JWT)
│   │   └── api-error.interceptor.ts #   ProblemDetails → Error normalization
│   ├── mock/mock-data.ts            # Demo payloads mirroring the C# models
│   ├── models/                      # TS interfaces matching C# schema (Wallet, ApprovalItem, DraftPayment, …)
│   └── state/                       # Signals-based stores
│       ├── theme-state.service.ts   #   palette + light/dark → <html data-palette class="dark">
│       ├── layout-ui-state.service.ts # single active overlay (popovers/drawers), sidebar accordion
│       ├── wallet-state.service.ts  #   wallets, selection, funding bar, chart controls
│       ├── approvals-state.service.ts # tabs, pending count, inline confirm state
│       ├── drafts-state.service.ts  #   tabs, "only mine" toggle
│       └── notifications-state.service.ts
├── shared/                          # Dumb, reusable UI
│   ├── ui/
│   │   ├── icon.component.ts        #   inline SVG registry (currentColor)
│   │   ├── drawer.component.ts      #   right slide-over shell (backdrop, Esc, animation)
│   │   ├── click-outside.directive.ts
│   │   ├── flag-icon.component.ts / avatar.component.ts / toggle-switch.component.ts
│   └── pipes/money.pipe.ts          #   "6,435.34" / "$6,435.34" / "+1,245.50"
├── layout/                          # Persistent shell (never re-renders on navigation)
│   ├── main-layout.component.ts     #   sidebar + header + <router-outlet> + footer + global drawers
│   ├── sidebar/                     #   nav config, routerLinkActive, Fund/Pay accordion
│   ├── header/                      #   search, upgrade CTA, appearance/drafts/bell/profile cluster
│   │   ├── appearance-popover.component.ts   # Image 3
│   │   └── notifications-popover.component.ts # Image 5
│   └── drawers/
│       ├── drafts-drawer.component.ts        # Image 4
│       └── approvals-drawer.component.ts     # Images 7 & 8
└── features/                        # Routed pages (all lazy-loaded)
    ├── dashboard/                   # Image 1 (+6, 9, 10)
    │   ├── dashboard.component.*
    │   └── components/
    │       ├── wallet-balance-card.component.ts   # gradient hero
    │       ├── wallet-selector.component.ts       # Image 9
    │       ├── status-popover.component.ts        # Image 6
    │       ├── funding-bar.component.ts           # Image 10
    │       ├── recent-activity.component.ts
    │       └── activity-chart.component.ts        # pure-SVG bar/line chart
    ├── wallets/wallets.component.ts
    └── placeholder/placeholder-page.component.ts  # stub for remaining sidebar routes
```

## Interaction map (screenshot → code)

| # | Mockup | Where |
|---|--------|-------|
| 1 | Dashboard overview | `features/dashboard/dashboard.component.*` |
| 2 | Fund sidebar accordion | `layout/sidebar/*` (`routerLinkActive` + `LayoutUiStateService.expandedNavGroup`) |
| 3 | Appearance palette popover | `layout/header/appearance-popover.component.ts` + `ThemeStateService` |
| 4 | Draft payments drawer | `layout/drawers/drafts-drawer.component.ts` + `DraftsStateService` |
| 5 | Notifications dropdown | `layout/header/notifications-popover.component.ts` |
| 6 | Company status popover | `features/dashboard/components/status-popover.component.ts` |
| 7 | Approvals drawer | `layout/drawers/approvals-drawer.component.ts` |
| 8 | Inline approve confirm | same file — `ApprovalsStateService.confirmingId` |
| 9 | Wallet switcher dropdown | `features/dashboard/components/wallet-selector.component.ts` |
| 10 | Funding bank selector | `features/dashboard/components/funding-bar.component.ts` |

## Key architectural decisions

- **Zoneless + signals.** No zone.js; every store exposes `signal`/`computed`
  and templates read them directly. `OnPush` on every component.
- **One overlay at a time.** `LayoutUiStateService` keeps a single
  `OverlayId | null` signal, so opening any popover/drawer closes the rest —
  matching how the mock behaves.
- **Theming via CSS custom properties.** `ThemeStateService` projects two
  signals onto `<html data-palette class="dark">`; `styles.scss` defines the
  token sets per palette/mode. A pre-paint script in `index.html` prevents a
  theme flash.
- **API layer mirrors the C# contract.** All interfaces match a conventional
  .NET `ApiResponse<T>` envelope; state services own the HttpClient calls and
  components never touch HTTP.
- **Lazy everything.** Each feature route is `loadComponent`, stub routes share
  one placeholder chunk with the title supplied via route `data`.
