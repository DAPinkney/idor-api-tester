# IDOR API Tester

A lightweight in-browser API testing tool built as a Tampermonkey userscript, designed for authorized security testing and IDOR (Insecure Direct Object Reference) vulnerability research.

Think Postman, but injected directly into the browser - no tab switching, no setup, toggle it on any page with a keyboard shortcut.

## Features

- **Full HTTP method support** - GET, POST, PUT, DELETE
- **Custom header injection** - CSRF token and cookie fields for authenticated request testing
- **JSON body editor** - Send structured payloads to test API endpoints
- **CORS bypass** - Uses `GM_xmlhttpRequest` to send cross-origin requests that the browser would normally block
- **Response viewer** - Pretty-printed JSON output with status code and response time in milliseconds
- **Copy to clipboard** - One click to copy the full response
- **Keyboard toggle** - Press `Shift + A` to show/hide the tool on any page

## Use Case

Built specifically for testing access control vulnerabilities. By injecting custom session cookies and CSRF tokens, you can test whether API endpoints properly validate that the authenticated user has permission to access the requested resource - the core of IDOR testing.

## Installation

1. Install the [Tampermonkey](https://www.tampermonkey.net/) browser extension
2. Open the Tampermonkey dashboard → Create a new script
3. Paste the contents of `idor-api-tester.js` and save
4. Navigate to any site and press `Shift + A` to open the tool

## Usage

1. Select HTTP method (GET, POST, PUT, DELETE)
2. Enter the target API endpoint URL
3. Optionally add a CSRF token and/or session cookie to simulate an authenticated user
4. Add a JSON body for POST/PUT requests
5. Hit **Send** and inspect the response

## Example

Testing whether a user can access another user's data by swapping a user ID in the endpoint:

```
Method: GET
URL: https://example.com/api/users/1043/profile
Cookie: session=abc123
```

If the server returns data for user 1043 without validating that the requester owns that account, the endpoint is vulnerable to IDOR.

## Disclaimer

This tool is intended for **authorized security testing and educational purposes only**. Only use it on systems you own or have explicit permission to test.
