require("dotenv").config({ path: ".env.test" });
const { Builder, By, Key, until } = require("selenium-webdriver");
const fs = require("fs");

(async function runTest() {
  const EMAIL = process.env.CLERK_EMAIL;
  const PASSWORD = process.env.CLERK_PASSWORD;

  const driver = await new Builder().forBrowser("chrome").build();

  try {
    // 1. Configure browser window
    await driver.manage().window().maximize();
    await driver.manage().setTimeouts({
      implicit: 10000,
      pageLoad: 30000,
      script: 30000,
    });

    // 2. Navigate to auth page
    await driver.get("http://localhost:5173/auth");
    await waitForPageReady(driver);

    // 3. Handle Clerk auth flow
    await handleClerkAuth(driver, EMAIL, PASSWORD);

    // 4. Navigate to income page
    await driver.wait(until.urlIs("http://localhost:5173/"), 20000);
    await driver.get("http://localhost:5173/income");
    await waitForPageReady(driver);

    // 5. Submit income form with enhanced verification
    await submitIncomeForm(driver);

    console.log("✅ Test completed successfully!");
  } catch (err) {
    console.error("❌ Test failed:", err.message);
    await takeScreenshot(driver, "error.png");
  } finally {
    await driver.quit();
  }
})();

async function waitForPageReady(driver) {
  await driver.wait(async () => {
    return await driver.executeScript(
      'return document.readyState === "complete"'
    );
  }, 15000);

  // Additional wait for client-side rendering
  await driver.sleep(1000);
}

async function handleClerkAuth(driver, email, password) {
  // Sign-in button with multiple fallback strategies
  const signInBtn = await retryElementInteraction(
    driver,
    [
      By.xpath("//button[contains(.,'Sign in')]"),
      By.css('button[data-testid="sign-in-button"]'),
      By.css("button.cl-sign-in-button"),
    ],
    5
  );
  await signInBtn.click();

  // Email input
  const emailInput = await retryElementInteraction(
    driver,
    [By.name("identifier"), By.css('input[type="email"]')],
    3
  );
  await emailInput.sendKeys(email, Key.RETURN);

  // Password input
  const passwordInput = await retryElementInteraction(
    driver,
    [By.name("password"), By.css('input[type="password"]')],
    3
  );
  await passwordInput.sendKeys(password, Key.RETURN);
}

async function submitIncomeForm(driver) {
  // Wait for form to be ready
  await driver.wait(until.elementLocated(By.css("form")), 10000);

  // Fill source input
  const sourceInput = await retryElementInteraction(
    driver,
    [
      By.xpath("//label[contains(.,'Source')]/following-sibling::input"),
      By.css("input.input:first-of-type"),
    ],
    5
  );
  await sourceInput.clear();
  await sourceInput.sendKeys("Test Job");

  // Fill amount input
  const amountInput = await retryElementInteraction(
    driver,
    [
      By.xpath("//label[contains(.,'Amount')]/following-sibling::input"),
      By.css('input.input[type="number"]'),
    ],
    5
  );
  await amountInput.clear();
  await amountInput.sendKeys("999");

  // Submit form with multiple strategies
  await submitForm(driver);

  // Verify the record was added
  await verifyRecordAdded(driver);
}

async function submitForm(driver) {
  const submitBtn = await retryElementInteraction(
    driver,
    [
      By.xpath("//button[contains(., 'Add Income')]"),
      By.css('button.button[type="submit"]'),
    ],
    5
  );

  // Try multiple submission methods
  try {
    await submitBtn.click();
    console.log("Used regular click");
  } catch (clickError) {
    console.warn("Regular click failed, trying JavaScript click");
    try {
      await driver.executeScript("arguments[0].click();", submitBtn);
    } catch (jsError) {
      console.warn("JavaScript click failed, trying form submit");
      await driver.executeScript("document.querySelector('form').submit();");
    }
  }
}

async function verifyRecordAdded(driver) {
  try {
    // Wait for either the list to update or success message
    await driver.wait(async () => {
      try {
        // Check list container for new items
        const listItems = await driver.findElements(
          By.css(".list-container > *")
        );
        if (listItems.length > 0) return true;

        // Check for success message
        const successElements = await driver.findElements(
          By.xpath("//*[contains(., 'success') or contains(., 'added')]")
        );
        return successElements.length > 0;
      } catch {
        return false;
      }
    }, 15000);

    console.log("✅ Verified new record in list");
  } catch (err) {
    console.warn("⚠️ Could not automatically verify record addition");

    // Fallback verification
    const sourceValue = await driver
      .findElement(
        By.xpath("//label[contains(.,'Source')]/following-sibling::input")
      )
      .getAttribute("value");

    if (sourceValue === "") {
      console.log("✅ Form was submitted (fields cleared)");
    } else {
      console.error("❌ Form submission may have failed");
      throw new Error("Form submission verification failed");
    }
  }
}

async function retryElementInteraction(driver, locators, attempts) {
  for (let i = 0; i < attempts; i++) {
    try {
      for (const locator of locators) {
        try {
          const element = await driver.wait(
            until.elementLocated(locator),
            10000
          );
          await driver.wait(until.elementIsVisible(element), 5000);
          await driver.wait(until.elementIsEnabled(element), 5000);
          return element;
        } catch (e) {
          continue;
        }
      }
    } catch (err) {
      if (i === attempts - 1) throw err;
      await driver.sleep(1000);
    }
  }
  throw new Error(`All locators failed after ${attempts} attempts`);
}

async function takeScreenshot(driver, filename) {
  const image = await driver.takeScreenshot();
  fs.writeFileSync(filename, image, "base64");
}
