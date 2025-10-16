# @quentli/js

[![npm version](https://img.shields.io/npm/v/@quentli/js.svg)](https://www.npmjs.com/package/@quentli/js)
[![npm downloads](https://img.shields.io/npm/dm/@quentli/js.svg)](https://www.npmjs.com/package/@quentli/js)
[![CI](https://github.com/quentli/quentli-js/actions/workflows/ci.yml/badge.svg)](https://github.com/quentli/quentli-js/actions/workflows/ci.yml)
[![Release](https://github.com/quentli/quentli-js/actions/workflows/release.yml/badge.svg)](https://github.com/quentli/quentli-js/actions/workflows/release.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Official JavaScript SDK for Quentli Payment and Setup Sessions. Secure and simple payment integration for web applications.

## Features

- **Payment Sessions**: Collect payments with seamless checkout experience
- **Setup Sessions**: Save payment methods without charging (subscriptions, future payments)
- Multiple display modes: popup, iframe, and redirect
- Framework agnostic - works with any JavaScript framework
- Zero dependencies
- Full TypeScript support
- Secure MessageChannel communication
- Automatic origin validation

## Installation

```bash
npm install @quentli/js
pnpm add @quentli/js
bun add @quentli/js
```

## Quick Start

### Payment Sessions

```typescript
import { Quentli } from '@quentli/js';

// Create instance
const quentli = new Quentli();

// Get payment session from your backend
const session = await fetch('/api/payment-session', {
  method: 'POST',
  body: JSON.stringify({ amount: 1000 })
}).then(r => r.json());

// Display payment in a popup window
await quentli.paymentSessions.displayPopup({
  url: session.url,
  session: {
    accessToken: session.session.accessToken,
    csrfToken: session.session.csrfToken
  },
  onComplete: (data) => {
    console.log('Payment completed:', data.status);
  },
  onCancel: () => {
    console.log('Payment canceled');
  },
  onError: (error) => {
    console.error('Payment error:', error);
  }
});

// Clean up when done
quentli.destroy();
```

### Setup Sessions

Save payment methods without charging (ideal for subscriptions).

```typescript
import { Quentli } from '@quentli/js';

const quentli = new Quentli();

// Get setup session from your backend
const setupSession = await fetch('/api/setup-session', {
  method: 'POST',
  body: JSON.stringify({ customerId: 'cus_123' })
}).then(r => r.json());

// Display setup in a popup window
await quentli.setupSessions.displayPopup({
  url: setupSession.url,
  session: {
    accessToken: setupSession.session.accessToken,
    csrfToken: setupSession.session.csrfToken
  },
  onPaymentMethodAdded: (data) => {
    console.log('Payment method saved:', data.paymentMethod);
  },
  onCancel: () => {
    console.log('Setup canceled');
  },
  onError: (error) => {
    console.error('Setup error:', error);
  }
});
```

## Display Modes

Both payment and setup sessions support three display modes:

### Popup (Recommended)

Opens payment/setup in a centered popup window.

```typescript
// Payment session
await quentli.paymentSessions.displayPopup({
  url: session.url,
  session: session.session,
  onComplete: (data) => { /* ... */ },
  width: 500,  // Optional
  height: 700  // Optional
});

// Setup session
await quentli.setupSessions.displayPopup({
  url: session.url,
  session: session.session,
  onPaymentMethodAdded: (data) => { /* ... */ },
  width: 500,
  height: 700
});
```

### Embedded (Iframe)

Embeds payment/setup directly in your page.

```typescript
// Payment session
const iframe = await quentli.paymentSessions.displayEmbedded({
  url: session.url,
  session: session.session,
  target: document.getElementById('payment-container'),
  onComplete: (data) => { /* ... */ },
  width: '100%',   // Optional
  height: '600px'  // Optional
});

// Setup session
const iframe = await quentli.setupSessions.displayEmbedded({
  url: session.url,
  session: session.session,
  target: document.getElementById('setup-container'),
  onPaymentMethodAdded: (data) => { /* ... */ }
});
```

### Page Redirect

Full page redirect to hosted checkout/setup page.

```typescript
// Payment session
quentli.paymentSessions.displayPage({
  url: session.url
});

// Setup session  
quentli.setupSessions.displayPage({
  url: session.url
});
```

## API Reference

### Constructor

```typescript
new Quentli(config?: QuentliConfig)
```

**Options:**
- `debug?: boolean` - Enable debug logging

### Properties

#### `quentli.paymentSessions`

Access the payment session display methods namespace.

#### `quentli.setupSessions`

Access the setup session display methods namespace.

### Payment Session Methods

#### `paymentSessions.displayPopup(options)`

Display payment session in a popup window.

**Options:**
- `url: string` - Payment session URL from backend
- `session: QuentliSession` - Session credentials (accessToken, csrfToken)
- `onComplete?: (data) => void` - Completion callback
- `onCancel?: () => void` - Cancellation callback
- `onError?: (error) => void` - Error callback
- `width?: number` - Window width (default: 500)
- `height?: number` - Window height (default: 700)
- `windowName?: string` - Window name

**Returns:** `Promise<void>`

#### `paymentSessions.displayEmbedded(options)`

Display payment session embedded in an iframe.

**Options:**
- `url: string` - Payment session URL from backend
- `session: QuentliSession` - Session credentials (accessToken, csrfToken)
- `target: HTMLElement` - Container element
- `onComplete?: (data) => void` - Completion callback
- `onCancel?: () => void` - Cancellation callback
- `onError?: (error) => void` - Error callback
- `width?: string` - Iframe width (default: '100%')
- `height?: string` - Iframe height (default: '600px')
- `className?: string` - CSS class name
- `allow?: string` - iframe allow attribute (default: 'payment')

**Returns:** `Promise<HTMLIFrameElement>`

#### `paymentSessions.displayPage(options)`

Redirect to payment session page.

**Options:**
- `url: string` - Payment session URL from backend

**Returns:** `void`

### Setup Session Methods

#### `setupSessions.displayPopup(options)`

Display setup session in a popup window.

**Options:**
- `url: string` - Setup session URL from backend
- `session: QuentliSession` - Session credentials (accessToken, csrfToken)
- `onPaymentMethodAdded?: (data) => void` - Payment method added callback
- `onCancel?: () => void` - Cancellation callback
- `onError?: (error) => void` - Error callback
- `width?: number` - Window width (default: 500)
- `height?: number` - Window height (default: 700)
- `windowName?: string` - Window name

**Returns:** `Promise<void>`

#### `setupSessions.displayEmbedded(options)`

Display setup session embedded in an iframe.

**Options:**
- `url: string` - Setup session URL from backend
- `session: QuentliSession` - Session credentials (accessToken, csrfToken)
- `target: HTMLElement` - Container element
- `onPaymentMethodAdded?: (data) => void` - Payment method added callback
- `onCancel?: () => void` - Cancellation callback
- `onError?: (error) => void` - Error callback
- `width?: string` - Iframe width (default: '100%')
- `height?: string` - Iframe height (default: '600px')
- `className?: string` - CSS class name
- `allow?: string` - iframe allow attribute (default: 'payment')

**Returns:** `Promise<HTMLIFrameElement>`

#### `setupSessions.displayPage(options)`

Redirect to setup session page.

**Options:**
- `url: string` - Setup session URL from backend

**Returns:** `void`

### Instance Methods

#### `destroy()`

Cleans up all resources. Always call when done.

#### `isActive()`

Returns whether the instance is active.

## TypeScript

Full type definitions included:

```typescript
import type {
  Quentli,
  PaymentSessions,
  SetupSessions,
  QuentliConfig,
  DisplayPopupOptions,
  DisplayEmbeddedOptions,
  DisplayPageOptions,
  SetupSessionDisplayPopupOptions,
  SetupSessionDisplayEmbeddedOptions,
  SetupSessionDisplayPageOptions,
  PaymentCompletionData,
  PaymentMethodAddedData,
  PaymentStatus
} from '@quentli/js';
```

## Backend Integration

Create sessions on your backend using the Quentli API:

### Payment Sessions

```typescript
// POST /v1/payment-sessions
{
  url: string;           // Checkout URL
  session: {
    accessToken: string; // Session access token
    csrfToken: string;   // CSRF token
    expiresAt: string;   // Session expiration
  },
  paymentSession: { /* ... */ }
}
```

### Setup Sessions

```typescript
// POST /v1/setup-sessions
{
  url: string;           // Setup URL
  session: {
    accessToken: string; // Session access token
    refreshToken: string; // Refresh token
    csrfToken: string;   // CSRF token
    expiresAt: string;   // Session expiration
  }
}
```

See [Quentli API Documentation](https://docs.quentli.com) for complete API reference.

## Examples

Live demos and code examples:

- 🔗 [Payment Sessions Demo](https://quentli-example-payment-sessions-next.vercel.app/)
- 🔗 [Setup Sessions Demo](https://quentli-example-setup-sessions-next.vercel.app/)
- 💻 [Next.js Payment Example](https://github.com/quentli/quentli-examples/tree/main/examples/payment-sessions-nextjs)
- 💻 [Next.js Setup Example](https://github.com/quentli/quentli-examples/tree/main/examples/setup-sessions-nextjs)

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Modern mobile browsers

Requires MessageChannel API, ES2020, and postMessage support.

## License

MIT © Quentli

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

This project uses [semantic-release](https://semantic-release.gitbook.io/) for automated versioning and publishing. Please use [Conventional Commits](https://www.conventionalcommits.org/) format for your commit messages.

## Links

- 📦 [npm Package](https://www.npmjs.com/package/@quentli/js)
- 📖 [Documentation](https://docs.quentli.com)
- 🔄 [Changelog](https://github.com/quentli/quentli-js/releases)
- 🐛 [Report Issues](https://github.com/quentli/quentli-js/issues)
- 💬 [Support](mailto:soporte@quentli.com)
