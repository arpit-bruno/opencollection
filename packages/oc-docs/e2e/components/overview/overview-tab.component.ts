import type { Locator } from '@playwright/test';
import { BaseComponent } from '../base.component';
import { MarkdownComponent } from '../markdown.component';

/**
 * The shared Overview tab used by the request pane, collection settings and
 * folder settings. It renders the item's docs as Markdown, or an empty state
 * with a context-specific subheading when there are none. Scope it to the tabs
 * container by its `testId` (`playground-view` for the request pane, collection
 * settings and folder settings), and pass the tab-strip's `testId` base as
 * `tabsTestId` (`tabs` for the request pane and folder settings;
 * `collection-settings-tabs` for collection settings).
 */
export class OverviewTabComponent extends BaseComponent {
  readonly markdown = new MarkdownComponent(this.page, this.root.getByTestId('overview-markdown-documentation'));
  readonly empty = this.root.getByTestId('overview-empty');
  readonly emptyHeading = this.root.getByTestId('overview-empty-heading');

  constructor(page: OverviewTabComponent['page'], containerTestId: string, private readonly tabsTestId = 'tabs') {
    super(page, page.getByTestId(containerTestId));
  }

  get tabButton(): Locator {
    return this.root.getByTestId(`${this.tabsTestId}-tab-overview`);
  }

  async open(): Promise<void> {
    await this.tabButton.click();
  }
}
