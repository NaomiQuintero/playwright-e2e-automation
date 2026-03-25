# Playwright E2E Automation Framework

This project demonstrates an end-to-end test automation framework built using Playwright and TypeScript.

## 👩🏻‍💻 Project Overview

The goal of this project is to validate a complete user purchase flow in a web application, ensuring both **UI behavior** and **business logic correctness**.

## 🚀 Features

- Page Object Model (POM)
- Test data management using JSON
- Positive and negative test scenarios
- Clean and scalable structure
- Cross-browser testing (Playwright default)

## 🧪 Test Coverage

### 🔐 Login
- Successful login
- Invalid login scenarios

### 🛒 Cart
- Add single product
- Add multiple products
- Validate cart contents

### 🧾 Checkout
- Complete checkout flow
- Form validation (negative scenarios)
- Validation of products in checkout overview

### 💰 Business Logic Validation
- Validate that the **sum of item prices matches the UI subtotal**
- Use of `toBeCloseTo` for floating-point precision handling

### 🔁 End-to-End Flow
- Full purchase flow from login to order confirmation

## 🛠️ Tech Stack

- Playwright
- TypeScript
- Node.js

## 📂 Project Structure
src/
pages/
fixtures/
tests/
test-data/


## ▶️ Run Tests

```bash
npx playwright test
## 📊 View Report
npx playwright show-report
🎯 Purpose
```

This project was built to demonstrate QA Automation skills, focusing on scalable test architecture and best practices aligned with an SDET role.x

## 👩🏻‍💻 Author

Naomi Quintero
QA Automation Engineer (SDET Path)