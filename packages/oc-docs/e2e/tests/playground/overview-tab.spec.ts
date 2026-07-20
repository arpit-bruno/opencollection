import { test, expect } from '../../playwright';

const DESKTOP = { width: 1280, height: 900 };
const openAt = (dock: string): string => `/#/?pg=1&dock=${dock}`;

const REQUEST_EMPTY_SUBHEADING = 'This request has no docs';
const COLLECTION_EMPTY_SUBHEADING = 'This collection has no docs';
const FOLDER_EMPTY_SUBHEADING = 'This folder has no docs';

test.describe('Playground — Overview tab', () => {
  test.use({ viewport: DESKTOP });

  test.beforeEach(async ({ page }) => {
    await page.goto(openAt('bottom'));
  });

  test.describe('request pane', () => {
    test('renders the request docs as Markdown when the request has docs', async ({ playground }) => {
      // "get users" (root-level request) carries a docs string.
      await playground.openRequest('get users');
      await playground.overview.open();

      await expect(playground.overview.markdown.root).toBeVisible();
      await expect(playground.overview.markdown.paragraph('Retrieve a paginated list of users')).toBeVisible();
      await expect(playground.overview.empty).toHaveCount(0);
    });

    test('shows the request-specific empty state when the request has no docs', async ({ playground }) => {
      // "echo json" (root-level request) has no docs field.
      await playground.openRequest('echo json');
      await playground.overview.open();

      await expect(playground.overview.empty).toBeVisible();
      await expect(playground.overview.emptyHeading).toHaveText('No overview content yet');
      await expect(playground.overview.empty).toContainText(REQUEST_EMPTY_SUBHEADING);
      await expect(playground.overview.markdown.root).toHaveCount(0);
    });

    test('renders Markdown for a nested request with docs', async ({ playground }) => {
      // Get All Customers lives under billing › customers and has multi-line docs.
      await playground.openTreeItem(['billing', 'customers', 'Get All Customers']);
      await playground.overview.open();

      await expect(playground.overview.markdown.root).toBeVisible();
      await expect(playground.overview.markdown.heading('Get All Customers')).toBeVisible();
    });
  });

  test.describe('collection settings', () => {
    test('renders the collection docs as Markdown (the collection has docs)', async ({ collectionSettings }) => {
      await collectionSettings.open();
      await collectionSettings.openTab('overview');

      await expect(collectionSettings.overviewMarkdown).toBeVisible();
      await expect(collectionSettings.overviewMarkdown).toContainText('Getting Started');
      await expect(collectionSettings.overviewEmpty).toHaveCount(0);
    });
  });

  test.describe('folder settings', () => {
    // Opening a folder in the playground shows its settings; the customers folder
    // has no docs, so its overview must show the folder-specific empty state.
    test('shows the folder-specific empty state when the folder has no docs', async ({ playground }) => {
      await playground.openTreeItem(['billing', 'customers']);
      await playground.overview.open();

      await expect(playground.overview.empty).toBeVisible();
      await expect(playground.overview.emptyHeading).toHaveText('No overview content yet');
      await expect(playground.overview.empty).toContainText(FOLDER_EMPTY_SUBHEADING);
      await expect(playground.overview.markdown.root).toHaveCount(0);
    });
  });

  test('each context shows its own distinct empty-state copy', async ({ playground }) => {
    await test.step('request pane uses the request copy', async () => {
      await playground.openRequest('echo json');
      await playground.overview.open();
      await expect(playground.overview.empty).toContainText(REQUEST_EMPTY_SUBHEADING);
      await expect(playground.overview.empty).not.toContainText(COLLECTION_EMPTY_SUBHEADING);
      await expect(playground.overview.empty).not.toContainText(FOLDER_EMPTY_SUBHEADING);
    });

    await test.step('folder settings uses the folder copy', async () => {
      await playground.openTreeItem(['billing', 'customers']);
      await playground.overview.open();
      await expect(playground.overview.empty).toContainText(FOLDER_EMPTY_SUBHEADING);
      await expect(playground.overview.empty).not.toContainText(REQUEST_EMPTY_SUBHEADING);
    });
  });
});
