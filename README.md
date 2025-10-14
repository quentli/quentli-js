# @quentli/js

Official JavaScript SDK for Quentli Payment Sessions. This package provides a simple and secure way to integrate Quentli payment checkout into your web application.

## Features

- 🔒 **Secure Communication** - Uses MessageChannel API for secure credential transfer
- 🪟 **Multiple Display Modes** - Supports popup, iframe, and redirect flows
- 🎯 **Framework Agnostic** - Works with vanilla JavaScript or any framework
- 📦 **Zero Dependencies** - Lightweight and efficient
- 🔧 **TypeScript Support** - Fully typed for excellent DX
- 🛡️ **Origin Validation** - Automatic security checks against payment session URL

## Installation

```bash
npm install @quentli/js
```

Or with other package managers:

```bash
yarn add @quentli/js
pnpm add @quentli/js
```

## Quick Start

```typescript
import { Quentli } from '@quentli/js';

// 1. Create a Quentli instance
const quentli = new Quentli();

// 2. Create a payment session on your backend
const session = await fetch('/api/create-payment-session', {
  method: 'POST',
  body: JSON.stringify({ amount: 1000, customerId: '123' })
}).then(r => r.json());

// 3. Initiate payment session with your preferred display mode

// Option A: Popup window (recommended)
await quentli.initiatePaymentSession({
  displayMode: 'popup',
  url: session.url,
  session: {
    accessToken: session.session.accessToken,
    csrfToken: session.session.csrfToken
  },
  onComplete: (data) => {
    console.log('Payment completed!', data.status);
    // Handle successful payment
  },
  onCancel: () => {
    console.log('Payment canceled');
    // Handle cancellation
  },
  onError: (error) => {
    console.error('Payment error:', error);
    // Handle errors
  }
});

// Option B: Iframe
await quentli.initiatePaymentSession({
  displayMode: 'iframe',
  url: session.url,
  session: session.session,
  target: document.getElementById('payment-container'),
  onComplete: (data) => console.log('Payment completed!', data.status),
  onCancel: () => console.log('Payment canceled'),
  onError: (error) => console.error('Payment error:', error)
});

// Option C: Full page redirect
quentli.initiatePaymentSession({
  displayMode: 'redirect',
  url: session.url
});

// 4. Clean up when done (important!)
quentli.destroy();
```

## API Reference

### `Quentli`

Main class for handling payment sessions.

#### Constructor

```typescript
new Quentli(config?: QuentliConfig)
```

**Config Options:**

| Option | Type | Description |
|--------|------|-------------|
| `debug` | `boolean` | Optional: Enable debug logging |

#### Methods

##### `initiatePaymentSession(options: InitiatePaymentSessionOptions): Promise<HTMLIFrameElement | void>`

Initiates a payment session with the specified display mode.

**Popup Mode:**

```typescript
await quentli.initiatePaymentSession({
  displayMode: 'popup',
  url: 'https://checkout.quentli.com/session/...',
  session: {
    accessToken: '...',
    csrfToken: '...'
  },
  onComplete: (data) => { /* handle completion */ },
  onCancel: () => { /* handle cancellation */ },
  onError: (error) => { /* handle error */ },
  width: 500,  // Optional, default: 500
  height: 700, // Optional, default: 700
  windowName: 'quentli_payment' // Optional
});
```

**Iframe Mode:**

```typescript
const iframe = await quentli.initiatePaymentSession({
  displayMode: 'iframe',
  url: 'https://checkout.quentli.com/session/...',
  session: {
    accessToken: '...',
    csrfToken: '...'
  },
  target: document.getElementById('container'),
  onComplete: (data) => { /* handle completion */ },
  onCancel: () => { /* handle cancellation */ },
  onError: (error) => { /* handle error */ },
  width: '100%',    // Optional, default: '100%'
  height: '600px',  // Optional, default: '600px'
  className: 'my-iframe', // Optional
  allow: 'payment'  // Optional, default: 'payment'
});
```

**Redirect Mode:**

```typescript
quentli.initiatePaymentSession({
  displayMode: 'redirect',
  url: 'https://checkout.quentli.com/session/...'
});
```

##### `destroy(): void`

Cleans up all resources. Always call this when done.

```typescript
quentli.destroy();
```

##### `isActive(): boolean`

Checks if the instance is still active.

```typescript
if (quentli.isActive()) {
  // Instance is active
}
```

## Display Modes

### Popup Window (Recommended)

Best for most use cases. Opens checkout in a centered popup window.

**Pros:**
- Clean UX - doesn't leave your page
- Easy to implement
- Good for mobile and desktop

**Example:**
```typescript
await quentli.initiatePaymentSession({
  displayMode: 'popup',
  url: session.url,
  session: session.session,
  onComplete: (data) => console.log('Complete!', data),
  onCancel: () => console.log('Canceled'),
  onError: (error) => console.error('Error:', error)
});
```

### Iframe (Embedded)

Embeds checkout directly in your page.

**Pros:**
- Fully integrated experience
- Complete control over surrounding UI

**Cons:**
- Requires more layout work
- May need responsive handling

**Example:**
```typescript
await quentli.initiatePaymentSession({
  displayMode: 'iframe',
  url: session.url,
  session: session.session,
  target: document.getElementById('payment-container'),
  onComplete: (data) => console.log('Complete!', data),
  onCancel: () => console.log('Canceled'),
  onError: (error) => console.error('Error:', error)
});
```

### Redirect (Full Page)

Redirects user to Quentli's hosted checkout page.

**Pros:**
- Simplest implementation
- No JavaScript required
- Works everywhere

**Cons:**
- Leaves your site
- Requires return URL setup

**Example:**
```typescript
quentli.initiatePaymentSession({
  displayMode: 'redirect',
  url: session.url
});
```

## TypeScript Support

This package is written in TypeScript and includes full type definitions.

```typescript
import type {
  Quentli,
  QuentliConfig,
  InitiatePaymentSessionOptions,
  PaymentCompletionData,
  PaymentStatus
} from '@quentli/js';
```

## Security

The SDK implements several security measures:

1. **Origin Validation** - Automatically validates postMessage origins against the payment session URL origin
2. **MessageChannel API** - Secure credential transfer without exposing to page context
3. **CSRF Protection** - Validates CSRF tokens from backend

The SDK automatically extracts and validates the origin from the payment session URL you provide, ensuring that messages only come from the expected checkout domain.

## Examples

### React Example

```typescript
import { useEffect, useRef } from 'react';
import { Quentli } from '@quentli/js';

function CheckoutButton() {
  const quentliRef = useRef<Quentli | null>(null);

  useEffect(() => {
    quentliRef.current = new Quentli();

    return () => {
      quentliRef.current?.destroy();
    };
  }, []);

  const handleCheckout = async () => {
    const session = await createPaymentSession();
    
    await quentliRef.current?.initiatePaymentSession({
      displayMode: 'popup',
      url: session.url,
      session: session.session,
      onComplete: (data) => {
        console.log('Payment completed:', data);
      },
      onCancel: () => {
        console.log('Payment canceled');
      },
      onError: (error) => {
        console.error('Payment error:', error);
      }
    });
  };

  return <button onClick={handleCheckout}>Pay Now</button>;
}
```

### Vue Example

```typescript
import { onMounted, onUnmounted, ref } from 'vue';
import { Quentli } from '@quentli/js';

export default {
  setup() {
    const quentli = ref<Quentli | null>(null);

    onMounted(() => {
      quentli.value = new Quentli();
    });

    onUnmounted(() => {
      quentli.value?.destroy();
    });

    const handleCheckout = async () => {
      const session = await createPaymentSession();
      await quentli.value?.initiatePaymentSession({
        displayMode: 'popup',
        url: session.url,
        session: session.session,
        onComplete: (data) => {
          console.log('Payment completed:', data);
        },
        onCancel: () => {
          console.log('Payment canceled');
        },
        onError: (error) => {
          console.error('Payment error:', error);
        }
      });
    };

    return { handleCheckout };
  }
};
```

## Creating Payment Sessions

Payment sessions must be created on your backend using the Quentli API. The SDK expects the following structure:

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

See [Quentli API Documentation](https://docs.quentli.com) for backend integration details.

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- All modern mobile browsers

Requires support for:
- MessageChannel API
- ES2020 features
- postMessage API

## Related Packages

- **[@quentli/react](https://github.com/quentli/quentli-js/tree/main/packages/react)** - React hooks and components
- **[@quentli/vue](https://github.com/quentli/quentli-js/tree/main/packages/vue)** - Vue composables (coming soon)

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

## License

MIT © Quentli

## Support

- 📚 [Documentation](https://docs.quentli.com)
- 🐛 [Issue Tracker](https://github.com/quentli/quentli-js/issues)
- 💬 [Discord Community](https://discord.gg/quentli)
- ✉️ [Email Support](mailto:soporte@quentli.com)

