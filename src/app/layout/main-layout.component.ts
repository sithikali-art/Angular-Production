import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { LayoutUiStateService } from '../core/state/layout-ui-state.service';
import { ApprovalsDrawerComponent } from './drawers/approvals-drawer/approvals-drawer.component';
import { DraftsDrawerComponent } from './drawers/drafts-drawer/drafts-drawer.component';
import { WalletDetailsDrawerComponent } from './drawers/wallet-details-drawer/wallet-details-drawer.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { MobileBottomNavComponent } from './mobile-nav/mobile-bottom-nav.component';
import { SidebarComponent } from './sidebar/sidebar.component';

/**
 * Persistent application shell: the sidebar, header and footer never
 * re-render on navigation — only the routed outlet content swaps
 * (with a page-in transition). The global slide-over drawers live
 * here so any page can summon them.
 */
@Component({
  selector: 'app-main-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterOutlet,
    SidebarComponent,
    HeaderComponent,
    FooterComponent,
    MobileBottomNavComponent,
    DraftsDrawerComponent,
    ApprovalsDrawerComponent,
    WalletDetailsDrawerComponent,
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {
  readonly layoutUi = inject(LayoutUiStateService);
}
