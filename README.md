# GovWifi Shared Frontend

## Description
This package offers shared functionality across the three websites
that make GovWifi (admin, product page, docs).

## Usage
- `npm install`;
- Add a page load event listener and plug the API described below;

## API

### `checkCookiePolicy(elementId)`
Checks whether cookie policy is defined and prompts the user with a
dialog to define it if not. The dialog will be replace the node
indicated by `elementId` (e.g `#cookie-banner`).
