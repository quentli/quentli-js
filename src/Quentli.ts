import type {
  QuentliConfig,
  InitiatePaymentSessionOptions,
  PopupPaymentSessionOptions,
  IframePaymentSessionOptions,
  RedirectPaymentSessionOptions,
  QuentliSession,
  QuentliMessage,
  PaymentStatus,
  PaymentCompletionData,
} from './types';
import { calculatePopupPosition, generateWindowFeatures, Logger } from './utils';

/**
 * Quentli - Core class for handling Quentli payment sessions
 * 
 * Manages the communication between merchant site and Quentli checkout
 * using MessageChannel API for secure credential transfer.
 * 
 * @example
 * ```typescript
 * const quentli = new Quentli();
 * 
 * await quentli.initiatePaymentSession({
 *   displayMode: 'popup',
 *   url: paymentUrl,
 *   session: { accessToken: '...', csrfToken: '...' },
 *   onComplete: (data) => console.log('Payment completed:', data),
 *   onCancel: () => console.log('Payment canceled'),
 *   onError: (error) => console.error('Error:', error)
 * });
 * ```
 */
export class Quentli {
  private messageChannel: MessageChannel | null = null;
  private popupWindow: Window | null = null;
  private iframeElement: HTMLIFrameElement | null = null;
  private messageHandler: ((event: MessageEvent) => void) | null = null;
  private popupCheckInterval: number | null = null;
  private pendingSession: QuentliSession | null = null;
  private expectedOrigin: string | null = null;
  private sessionCallbacks: {
    onComplete?: (data: PaymentCompletionData) => void;
    onCancel?: () => void;
    onError?: (error: Error) => void;
  } = {};
  private logger: Logger;
  private isDestroyed = false;

  constructor(config: QuentliConfig = {}) {
    this.logger = new Logger(config.debug, '[Quentli]');
    this.setupMessageListener();
    this.logger.log('Quentli initialized');
  }

  /**
   * Set up the global message listener for postMessage events
   */
  private setupMessageListener(): void {
    this.messageHandler = (event: MessageEvent) => {
      // Validate origin matches the expected checkout URL origin
      if (this.expectedOrigin && event.origin !== this.expectedOrigin) {
        this.logger.warn('Received message from unexpected origin:', event.origin);
        return;
      }

      const message = event.data as QuentliMessage;

      if (!message || !message.type) {
        return;
      }

      this.logger.log('Received message:', message.type);

      switch (message.type) {
        case 'READY':
          this.handleReady(event);
          break;
        case 'PAYMENT_COMPLETED':
          this.handlePaymentCompleted(event);
          break;
        default:
          this.logger.warn('Unknown message type:', message.type);
      }
    };

    window.addEventListener('message', this.messageHandler);
  }

  /**
   * Handle READY message from checkout
   * Initiates the secure credential transfer via MessageChannel
   */
  private handleReady(event: MessageEvent): void {
    this.logger.log('Handling READY event');

    const targetWindow = this.popupWindow || this.iframeElement?.contentWindow;

    if (!targetWindow) {
      this.logger.error('No target window available');
      return;
    }

    if (!this.pendingSession) {
      this.logger.error('No pending session available');
      return;
    }

    try {
      // Create a new MessageChannel for secure communication
      this.messageChannel = new MessageChannel();

      // Listen for messages on port1
      this.messageChannel.port1.onmessage = (e: MessageEvent) => {
        const message = e.data as QuentliMessage;
        this.logger.log('Received message on MessageChannel:', message.type);

        if (message.type === 'PAYMENT_COMPLETED') {
          this.handlePaymentCompleted(e);
        }
      };

      // Send credentials and transfer port2 to the payment window
      targetWindow.postMessage(
        {
          type: 'INIT',
          accessToken: this.pendingSession.accessToken,
          csrfToken: this.pendingSession.csrfToken,
        },
        event.origin,
        [this.messageChannel.port2] // Transfer port2
      );

      this.logger.log('Sent INIT message with credentials');
    } catch (error) {
      this.logger.error('Error handling READY:', error);
      this.sessionCallbacks.onError?.(
        error instanceof Error ? error : new Error('Failed to initialize payment session')
      );
    }
  }

  /**
   * Handle PAYMENT_COMPLETED message
   */
  private handlePaymentCompleted(event: MessageEvent): void {
    const message = event.data as QuentliMessage;
    this.logger.log('Payment completed with status:', message.status);

    // Clean up windows/iframes
    this.cleanup();

    const status = message.status as PaymentStatus;

    if (status === 'COMPLETE' || status === 'DECLINED') {
      this.sessionCallbacks.onComplete?.({
        status,
        paymentSessionId: message.paymentSessionId as string | undefined,
        ...message,
      });
    } else if (status === 'CANCELED') {
      this.sessionCallbacks.onCancel?.();
    }

    // Clear callbacks after use
    this.sessionCallbacks = {};
  }

  /**
   * Initiate a payment session with the specified display mode
   */
  async initiatePaymentSession(options: InitiatePaymentSessionOptions): Promise<HTMLIFrameElement | void> {
    if (this.isDestroyed) {
      throw new Error('Quentli instance has been destroyed');
    }

    this.logger.log('Initiating payment session with options:', { displayMode: options.displayMode });

    // Handle redirect separately (no callbacks needed)
    if (options.displayMode === 'redirect') {
      return this.handleRedirect(options);
    }

    // Extract and store expected origin from the payment URL
    try {
      const urlObj = new URL(options.url);
      this.expectedOrigin = urlObj.origin;
      this.logger.log('Expected origin set to:', this.expectedOrigin);
    } catch (error) {
      const err = new Error('Invalid payment URL provided');
      this.logger.error('Failed to parse URL:', error);
      options.onError?.(err);
      throw err;
    }

    // Store callbacks for this session
    this.sessionCallbacks = {
      onComplete: options.onComplete,
      onCancel: options.onCancel,
      onError: options.onError,
    };

    // Store session for later use
    this.pendingSession = options.session;

    if (options.displayMode === 'popup') {
      return this.handlePopup(options);
    } else if (options.displayMode === 'iframe') {
      return this.handleIframe(options);
    }
  }

  /**
   * Handle popup display mode
   */
  private async handlePopup(options: PopupPaymentSessionOptions): Promise<void> {
    const width = options.width || 500;
    const height = options.height || 700;
    const { left, top } = calculatePopupPosition(width, height);
    const features = generateWindowFeatures(width, height, left, top);

    try {
      this.popupWindow = window.open(
        options.url,
        options.windowName || 'quentli_payment_session',
        features
      );

      if (!this.popupWindow) {
        throw new Error('Failed to open popup window. Please allow popups for this site.');
      }

      // Poll for popup close
      this.popupCheckInterval = window.setInterval(() => {
        if (this.popupWindow?.closed) {
          this.logger.log('Popup window closed by user');
          this.cleanup();
          this.sessionCallbacks.onCancel?.();
          this.sessionCallbacks = {};
        }
      }, 500);

      this.logger.log('Popup opened successfully');
    } catch (error) {
      this.logger.error('Error opening popup:', error);
      const err = error instanceof Error ? error : new Error('Failed to open popup window');
      this.sessionCallbacks.onError?.(err);
      this.sessionCallbacks = {};
      throw err;
    }
  }

  /**
   * Handle iframe display mode
   */
  private async handleIframe(options: IframePaymentSessionOptions): Promise<HTMLIFrameElement> {
    try {
      const iframe = document.createElement('iframe');
      iframe.src = options.url;
      iframe.style.border = 'none';
      iframe.style.width = options.width || '100%';
      iframe.style.height = options.height || '600px';
      iframe.allow = options.allow || 'payment';
      
      if (options.className) {
        iframe.className = options.className;
      }

      options.target.appendChild(iframe);
      this.iframeElement = iframe;

      this.logger.log('Iframe created and appended successfully');

      return iframe;
    } catch (error) {
      this.logger.error('Error opening iframe:', error);
      const err = error instanceof Error ? error : new Error('Failed to open iframe');
      this.sessionCallbacks.onError?.(err);
      this.sessionCallbacks = {};
      throw err;
    }
  }

  /**
   * Handle redirect display mode
   */
  private handleRedirect(options: RedirectPaymentSessionOptions): void {
    this.logger.log('Redirecting to:', options.url);
    window.location.href = options.url;
  }

  /**
   * Clean up windows, iframes, and intervals
   */
  private cleanup(): void {
    this.logger.log('Cleaning up resources');

    // Close popup window
    if (this.popupWindow && !this.popupWindow.closed) {
      this.popupWindow.close();
      this.popupWindow = null;
    }

    // Remove iframe
    if (this.iframeElement) {
      this.iframeElement.remove();
      this.iframeElement = null;
    }

    // Clear popup check interval
    if (this.popupCheckInterval !== null) {
      clearInterval(this.popupCheckInterval);
      this.popupCheckInterval = null;
    }

    // Close MessageChannel
    if (this.messageChannel) {
      this.messageChannel.port1.close();
      this.messageChannel = null;
    }

    // Clear pending session
    this.pendingSession = null;

    // Clear expected origin
    this.expectedOrigin = null;

    // Clear callbacks
    this.sessionCallbacks = {};
  }

  /**
   * Destroy the Quentli instance and clean up all resources
   * Call this when you're done using the instance
   */
  destroy(): void {
    if (this.isDestroyed) {
      return;
    }

    this.logger.log('Destroying Quentli instance');

    this.cleanup();

    // Remove message listener
    if (this.messageHandler) {
      window.removeEventListener('message', this.messageHandler);
      this.messageHandler = null;
    }

    this.isDestroyed = true;
  }

  /**
   * Check if the instance has been destroyed
   */
  isActive(): boolean {
    return !this.isDestroyed;
  }
}

