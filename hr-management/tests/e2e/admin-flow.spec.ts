import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard Critical Path', () => {
    // Login as Super Admin before tests
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:3000/login');
        await page.fill('input[type="email"]', 'admin@rudratic.com');
        await page.fill('input[type="password"]', 'admin123'); // Assuming these are valid seed creds
        await page.click('button[type="submit"]');
        await expect(page).toHaveURL('http://localhost:3000/dashboard');

        // Navigate to Admin
        await page.goto('http://localhost:3000/admin');
    });

    test('should load admin dashboard with all widgets', async ({ page }) => {
        await expect(page).toHaveTitle(/Admin Dashboard|Executive Dashboard/);

        // Check for Key Widgets
        await expect(page.locator('text=Clocked In')).toBeVisible();
        await expect(page.locator('text=Pending Tasks')).toBeVisible();
        await expect(page.locator('text=System Status')).toBeVisible();

        // Check new widgets
        await expect(page.locator('text=Recent Activity')).toBeVisible();
    });

    test('should navigate to User Management', async ({ page }) => {
        await page.click('text=User Management');
        await expect(page).toHaveURL(/.*\/admin\/users/);
        await expect(page.locator('h1')).toContainText('User Directory');
    });

    test('should show remote validation for remote workers', async ({ page }) => {
        // Check if the widget exists. If no remote users are seeded, it might show "No active remote users"
        const widget = page.locator('text=Remote Validation');
        await expect(widget).toBeVisible();
    });

    test('should allow Report Generation', async ({ page }) => {
        // Use Quick Action
        await page.click('text=Report'); // From Quick Action Bar
        await expect(page).toHaveURL(/.*\/reports\/generate/);

        // Interact with form
        await page.click('text=Payroll Data Export');
        await page.click('text=CSV'); // Click radio

        // Note: We won't actually download to avoid file system complexity in test
        await expect(page.locator('button:has-text("Download")')).toBeEnabled();
    });
});
