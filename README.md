# @quentli/js

Official JavaScript SDK for Quentli Payment Sessions. Secure and simple payment integration for web applications.

## Features

- Secure credential transfer using MessageChannel API
- Multiple display modes: popup, iframe, and redirect
- Framework agnostic - works with any JavaScript framework
- Zero dependencies
- Full TypeScript support
- Automatic origin validation

## Installation

```bash
npm install @quentli/js
pnpm add @quentli/js
bun add @quentli/js
```

## Usage

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

## Display Modes

### Popup (Recommended)

Opens payment in a centered popup window.

```typescript
await quentli.paymentSessions.displayPopup({
  url: session.url,
  session: session.session,
  onComplete: (data) => { /* ... */ },
  onCancel: () => { /* ... */ },
  onError: (error) => { /* ... */ },
  width: 500,  // Optional
  height: 700  // Optional
});
```

### Embedded (Iframe)

Embeds payment directly in your page.

```typescript
const iframe = await quentli.paymentSessions.displayEmbedded({
  url: session.url,
  session: session.session,
  target: document.getElementById('payment-container'),
  onComplete: (data) => { /* ... */ },
  onCancel: () => { /* ... */ },
  onError: (error) => { /* ... */ },
  width: '100%',   // Optional
  height: '600px'  // Optional
});
```

### Page Redirect

Full page redirect to hosted checkout.

```typescript
quentli.paymentSessions.displayPage({
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

### Methods

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
  QuentliConfig,
  DisplayPopupOptions,
  DisplayEmbeddedOptions,
  DisplayPageOptions,
  PaymentCompletionData,
  PaymentStatus
} from '@quentli/js';
```

## Security

- **Origin Validation** - Validates postMessage origins against payment URL
- **MessageChannel API** - Secure credential transfer
- **CSRF Protection** - Token validation

The SDK automatically extracts the origin from your payment URL and validates all messages against it.

## Backend Integration

Create payment sessions on your backend:

```typescript
{
  url: string;           // Checkout URL
  session: {
    accessToken: string; // Session access token
    csrfToken: string;   // CSRF token
    expiresAt?: string;  // Optional expiration
  }
}
```

See [Quentli API Documentation](https://docs.quentli.com) for details.

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

- [Documentation](https://docs.quentli.com)
- [GitHub Issues](https://github.com/quentli/quentli-js/issues)
- [Support](mailto:soporte@quentli.com)
