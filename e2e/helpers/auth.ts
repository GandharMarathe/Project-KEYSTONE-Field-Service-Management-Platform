import { expect, type Page } from "@playwright/test";

// Local Flyway seed (V2/V3). Override with E2E_MANAGER_EMAIL / E2E_MANAGER_PASSWORD.
export const managerEmail = process.env.E2E_MANAGER_EMAIL ?? "admin@keystone.dev";
export const managerPassword = process.env.E2E_MANAGER_PASSWORD ?? "Keystone@2026Admin!";

export async function signIn(page: Page, email: string, password: string) {
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: "Sign in to MFM" })).toBeVisible();
  await page.getByRole("textbox", { name: "Email" }).fill(email);
  await page.getByRole("textbox", { name: "Password" }).fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
}

export async function signInManager(page: Page) {
  await signIn(page, managerEmail, managerPassword);
  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
}

export async function signOut(page: Page) {
  await page.getByRole("button", { name: "Log out" }).click();
  await expect(page).toHaveURL(/\/login/);
}

export async function openAppLink(page: Page, name: string) {
  await page.getByRole("link", { name, exact: true }).click();
}
