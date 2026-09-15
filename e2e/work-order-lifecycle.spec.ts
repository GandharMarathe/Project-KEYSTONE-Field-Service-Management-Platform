import { expect, test, type APIRequestContext } from "@playwright/test";
import { openAppLink, signIn, signInManager, signOut } from "./helpers/auth";

const apiUrl = process.env.E2E_API_URL ?? "http://localhost:8080";

async function assertApiUp(request: APIRequestContext) {
  const response = await request.get(`${apiUrl}/api/work-orders`);
  expect(response.status(), "API must be running on localhost:8080").toBeGreaterThanOrEqual(401);
  expect(response.status()).toBeLessThan(500);
}

function unique(label: string) {
  return `${label}-${Date.now()}`;
}

test.describe.configure({ mode: "serial" });

test("manager creates a job, technician works it, manager closes it", async ({ page, request }) => {
  await assertApiUp(request);

  const stamp = Date.now();
  const customerName = unique("E2E Customer");
  const siteName = unique("E2E Site");
  const partNumber = `PN-E2E-${stamp}`;
  const partName = "E2E filter cartridge";
  const techEmail = `tech.e2e.${stamp}@keystone.test`;
  const techPassword = `TechE2e!${stamp}`;
  // Names must be unique: the assign dropdown labels by first+last only, so a
  // repeated "E2E Technician" would select an older user from a prior run.
  const techFirst = "E2E";
  const techLast = `Tech${stamp}`;
  const jobTitle = unique("E2E HVAC filter");

  await signInManager(page);
  await openAppLink(page, "Reports");
  await expect(page.getByRole("heading", { name: "Reports" })).toBeVisible();
  const closedBeforeText = await page.locator(".summary-table tr", { hasText: "Closed" }).locator("strong").innerText();
  const closedBefore = Number(closedBeforeText);

  await openAppLink(page, "Customers");
  await expect(page.getByRole("heading", { name: "Customers" })).toBeVisible();
  await page.getByRole("button", { name: "Add Customer" }).click();
  await page.getByRole("textbox", { name: "Name" }).fill(customerName);
  await page.getByRole("button", { name: "Create Customer" }).click();
  await expect(page.getByText(customerName)).toBeVisible();

  await openAppLink(page, "Sites");
  await expect(page.getByRole("heading", { name: "Sites" })).toBeVisible();
  await page.getByRole("button", { name: "Add Site" }).click();
  await page.locator("form.form-card").getByRole("combobox", { name: /^Customer/ }).selectOption({ label: customerName });
  await page.getByRole("textbox", { name: "Name" }).fill(siteName);
  await page.getByRole("textbox", { name: "Address line 1" }).fill("1 E2E Street");
  await page.getByRole("textbox", { name: "City" }).fill("Mumbai");
  await page.getByRole("button", { name: "Create Site" }).click();
  await expect(page.getByText(siteName)).toBeVisible();

  await openAppLink(page, "Parts");
  await expect(page.getByRole("heading", { name: "Parts" })).toBeVisible();
  await page.getByRole("button", { name: "Add Part" }).click();
  await page.getByRole("textbox", { name: "Part number" }).fill(partNumber);
  await page.getByRole("textbox", { name: "Name" }).fill(partName);
  await page.getByRole("textbox", { name: "Unit cost" }).fill("12.50");
  await page.getByRole("textbox", { name: "Stock quantity" }).fill("10");
  await page.getByRole("button", { name: "Create Part" }).click();
  await expect(page.locator(".table-row", { hasText: partNumber })).toContainText("10");

  await openAppLink(page, "Users");
  await expect(page.getByRole("heading", { name: "Users" })).toBeVisible();
  await page.getByRole("button", { name: "Add User" }).click();
  await page.getByRole("textbox", { name: "Email" }).fill(techEmail);
  await page.getByRole("textbox", { name: "Password" }).fill(techPassword);
  await page.getByRole("combobox", { name: /^Role/ }).selectOption("TECHNICIAN");
  await page.getByRole("textbox", { name: "First name" }).fill(techFirst);
  await page.getByRole("textbox", { name: "Last name" }).fill(techLast);
  await page.getByRole("button", { name: "Create User" }).click();
  await expect(page.getByText(techEmail)).toBeVisible();

  await openAppLink(page, "Work Orders");
  await expect(page.getByRole("heading", { name: "Work Orders" })).toBeVisible();
  await page.getByRole("link", { name: "Create Work Order" }).click();
  await expect(page.getByRole("heading", { name: "Create Work Order" })).toBeVisible();
  await page.getByRole("textbox", { name: "Title" }).fill(jobTitle);
  await page.getByRole("textbox", { name: "Description" }).fill("E2E replacement at the test site.");
  await page.getByRole("combobox", { name: /^Priority/ }).selectOption("HIGH");
  await page.getByRole("combobox", { name: /^Customer/ }).selectOption({ label: customerName });
  await expect(page.getByRole("combobox", { name: /^Site/ })).toContainText(siteName);
  await page.getByRole("combobox", { name: /^Site/ }).selectOption({ label: siteName });
  await page.getByRole("button", { name: "Create Work Order" }).click();

  await expect(page).toHaveURL(/\/work-orders\/\d+/);
  await expect(page.getByRole("heading", { name: jobTitle })).toBeVisible();
  const jobCode = (await page.locator(".detail-header .eyebrow").innerText()).trim();
  expect(jobCode).toMatch(/^WO-/);
  const jobPath = new URL(page.url()).pathname;

  await page.getByLabel("Select technician").selectOption({ label: `${techFirst} ${techLast}` });
  await page.getByRole("button", { name: "Assign technician" }).click();
  await expect(page.locator(".detail-header")).toContainText("ASSIGNED");
  await expect(page.getByRole("heading", { name: jobTitle })).toBeVisible();
  await expect(page.locator(".detail-header .eyebrow")).toHaveText(jobCode);
  await expect(page.getByRole("heading", { name: "Timeline" }).locator("..")).toContainText("Assigned");

  await signOut(page);
  await signIn(page, techEmail, techPassword);
  await expect(page).toHaveURL(/\/my-jobs/);
  await expect(page.getByRole("heading", { name: "My Jobs" })).toBeVisible();
  await expect(page.getByRole("heading", { name: jobTitle })).toBeVisible();
  await page.getByRole("heading", { name: jobTitle }).click();
  await expect(page).toHaveURL(/\/my-jobs\/\d+/);
  await expect(page.getByRole("heading", { name: jobTitle })).toBeVisible();
  await expect(page.locator(".detail-header .eyebrow")).toHaveText(jobCode);

  await page.getByRole("button", { name: "Start Job" }).click();
  await expect(page.getByRole("button", { name: "Complete Job" })).toBeVisible();
  await page.getByRole("button", { name: "Put On Hold" }).click();
  await expect(page.getByRole("button", { name: "Resume" })).toBeVisible();
  await page.getByRole("button", { name: "Resume" }).click();
  await expect(page.getByRole("button", { name: "Complete Job" })).toBeVisible();

  await page.getByRole("textbox", { name: "Minutes" }).fill("45");
  await page.getByRole("button", { name: "Log time" }).click();
  await expect(page.getByText("45 minutes")).toBeVisible();

  // Option text is "PN — name (stock N)". label must be a string (not RegExp).
  await page.getByRole("combobox", { name: /^Part/ }).selectOption({
    label: `${partNumber} — ${partName} (stock 10)`,
  });
  await page.getByRole("button", { name: "Log part" }).click();
  await expect(page.getByText(`${partNumber} · ${partName}`)).toBeVisible();
  await expect(page.getByText(/Qty 1 · unit cost 12\.5/)).toBeVisible();

  await expect(page.getByRole("heading", { name: jobTitle })).toBeVisible();
  await expect(page.locator(".detail-header .eyebrow")).toHaveText(jobCode);
  await page.getByRole("button", { name: "Complete Job" }).click();
  await expect(page.getByRole("button", { name: "Complete Job" })).toHaveCount(0);
  const timeline = page.getByRole("heading", { name: "Timeline" }).locator("..");
  await expect(timeline).toContainText("Start Job");
  await expect(timeline).toContainText("Put On Hold");
  await expect(timeline).toContainText("Resume");
  await expect(timeline).toContainText("Complete Job");

  await signOut(page);
  await signInManager(page);
  await openAppLink(page, "Work Orders");
  await page.getByLabel("Search work orders").fill(jobCode);
  await page.getByRole("link", { name: new RegExp(jobCode) }).click();
  await expect(page).toHaveURL(jobPath);
  await expect(page.getByRole("heading", { name: jobTitle })).toBeVisible();
  await expect(page.locator(".detail-header .eyebrow")).toHaveText(jobCode);
  await page.getByRole("button", { name: "Close Work Order" }).click();
  await expect(page.locator(".detail-header")).toContainText("CLOSED");
  await expect(page.getByRole("heading", { name: jobTitle })).toBeVisible();
  await expect(page.locator(".detail-header .eyebrow")).toHaveText(jobCode);
  await expect(page.getByRole("heading", { name: "Timeline" }).locator("..")).toContainText("Close Work Order");

  await openAppLink(page, "Reports");
  await expect(page.getByRole("heading", { name: "Reports" })).toBeVisible();
  // Poll: Reports may briefly show the cached summary before refetch lands.
  await expect
    .poll(async () => {
      const text = await page.locator(".summary-table tr", { hasText: "Closed" }).locator("strong").innerText();
      return Number(text);
    })
    .toBe(closedBefore + 1);
});
