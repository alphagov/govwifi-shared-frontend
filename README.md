# GovWifi Shared Frontend

## Description
This package offers shared functionality across the three websites
that make GovWifi (admin, product page, docs).

## Usage
- `npm install govwifi-shared-frontend`;
- include the file `dist/govwifi-shared-frontend.js`: it will install
  itself in `window.GovWifi`;
- Add a page load event listener and plug the API described below.

## API

### Cookies
Cookies functions are scoped to `GovWifi.cookies`.

#### `GovWifi.cookies.checkCookiePolicy(elementId)`
Checks whether cookie policy is defined and prompts the user with a
dialog to define it if not. The dialog will be replace the node
indicated by `elementId` (e.g `#cookie-banner`).

#### `GovWifi.cookies.isCategoryAllowed(categoryName)`
Indicate whether the user has agreed to that category of cookies. The
only category at the moment is `analytics` (and `essential`, but that
will always return true).

## TODO

- [X] add webpack to streamline distribution;
- [ ] add tests.
