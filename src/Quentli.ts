import type {
  QuentliConfig,
  DisplayPopupOptions,
  DisplayEmbeddedOptions,
  DisplayPageOptions,
  SetupSessionDisplayPopupOptions,
  SetupSessionDisplayEmbeddedOptions,
  SetupSessionDisplayPageOptions,
  QuentliAuthSession,
  QuentliMessage,
  PaymentStatus,
  PaymentCompletionData,
  PaymentMethodAddedData,
} from "./types";
import {
  calculatePopupPosition,
  generateWindowFeatures,
  Logger,
  validateUrl,
  validateSession,
  validateTarget,
} from "./utils";

/**
 * Base callbacks interface for sessions
 */
interface SessionCallbacks {
  onComplete?: (data: any) => void;
  onCancel?: () => void;
  onError?: (error: Error) => void;
}

/**
 * PaymentSessions - Namespace class for payment session display methods
 *
 * Provides methods to display payment sessions in different modes:
 * - displayPopup: Opens payment in a popup window
 * - displayEmbedded: Embeds payment in an iframe
 * - displayPage: Redirects to payment page
 */
export class PaymentSessions {
  constructor(private quentli: Quentli) {}

  /**
   * Display payment session in a popup window
   *
   * @example
   * ```typescript
   * await quentli.paymentSessions.displayPopup({
   *   url: paymentUrl,
   *   session: { accessToken: '...', csrfToken: '...' },
   *   onComplete: (data) => console.log('Payment completed:', data),
   *   width: 500,
   *   height: 700
   * });
   * ```
   */
  async displayPopup(options: DisplayPopupOptions): Promise<void> {
    // Validate required arguments for JavaScript users
    if (!options || typeof options !== 'object') {
      throw new Error('options is required and must be an object');
    }
    
    validateUrl((options as any).url);
    validateSession((options as any).session);
    
    this.quentli.cleanup();
    return this.quentli.initSession({
      ...options,
      sessionType: 'payment',
      displayMode: 'popup',
    });
  }

  /**
   * Display payment session embedded in an iframe
   *
   * @example
   * ```typescript
   * const iframe = await quentli.paymentSessions.displayEmbedded({
   *   url: paymentUrl,
   *   session: { accessToken: '...', csrfToken: '...' },
   *   target: document.getElementById('payment-container'),
   *   onComplete: (data) => console.log('Payment completed:', data)
   * });
   * ```
   */
  async displayEmbedded(
    options: DisplayEmbeddedOptions
  ): Promise<HTMLIFrameElement> {
    // Validate required arguments for JavaScript users
    if (!options || typeof options !== 'object') {
      throw new Error('options is required and must be an object');
    }
    
    validateUrl((options as any).url);
    validateSession((options as any).session);
    validateTarget((options as any).target);
    
    this.quentli.cleanup();
    return this.quentli.initSession({
      ...options,
      sessionType: 'payment',
      displayMode: 'iframe',
    });
  }

  /**
   * Redirect to payment session page
   *
   * @example
   * ```typescript
   * quentli.paymentSessions.displayPage({
   *   url: paymentUrl
   * });
   * ```
   */
  displayPage(options: DisplayPageOptions): void {
    // Validate required arguments for JavaScript users
    if (!options || typeof options !== 'object') {
      throw new Error('options is required and must be an object');
    }
    
    validateUrl((options as any).url);
    
    this.quentli.cleanup();
    this.quentli.handleRedirectInternal({
      ...options,
      sessionType: 'payment',
    });
  }
}

/**
 * SetupSessions - Namespace class for setup session display methods
 *
 * Provides methods to display setup sessions (for saving payment methods) in different modes:
 * - displayPopup: Opens setup in a popup window
 * - displayEmbedded: Embeds setup in an iframe
 * - displayPage: Redirects to setup page
 */
export class SetupSessions {
  constructor(private quentli: Quentli) {}

  /**
   * Display setup session in a popup window
   *
   * @example
   * ```typescript
   * await quentli.setupSessions.displayPopup({
   *   url: setupUrl,
   *   session: { accessToken: '...', csrfToken: '...' },
   *   onPaymentMethodAdded: (data) => console.log('Payment method added:', data),
   *   width: 500,
   *   height: 700
   * });
   * ```
   */
  async displayPopup(options: SetupSessionDisplayPopupOptions): Promise<void> {
    // Validate required arguments for JavaScript users
    if (!options || typeof options !== 'object') {
      throw new Error('options is required and must be an object');
    }
    
    validateUrl((options as any).url);
    validateSession((options as any).session);
    
    this.quentli.cleanup();
    return this.quentli.initSession({
      ...options,
      sessionType: 'setup',
      displayMode: 'popup',
    });
  }

  /**
   * Display setup session embedded in an iframe
   *
   * @example
   * ```typescript
   * const iframe = await quentli.setupSessions.displayEmbedded({
   *   url: setupUrl,
   *   session: { accessToken: '...', csrfToken: '...' },
   *   target: document.getElementById('setup-container'),
   *   onPaymentMethodAdded: (data) => console.log('Payment method added:', data)
   * });
   * ```
   */
  async displayEmbedded(
    options: SetupSessionDisplayEmbeddedOptions
  ): Promise<HTMLIFrameElement> {
    // Validate required arguments for JavaScript users
    if (!options || typeof options !== 'object') {
      throw new Error('options is required and must be an object');
    }
    
    validateUrl((options as any).url);
    validateSession((options as any).session);
    validateTarget((options as any).target);
    
    this.quentli.cleanup();
    return this.quentli.initSession({
      ...options,
      sessionType: 'setup',
      displayMode: 'iframe',
    });
  }

  /**
   * Redirect to setup session page
   *
   * @example
   * ```typescript
   * quentli.setupSessions.displayPage({
   *   url: setupUrl
   * });
   * ```
   */
  displayPage(options: SetupSessionDisplayPageOptions): void {
    // Validate required arguments for JavaScript users
    if (!options || typeof options !== 'object') {
      throw new Error('options is required and must be an object');
    }
    
    validateUrl((options as any).url);
    
    this.quentli.cleanup();
    this.quentli.handleRedirectInternal({
      ...options,
      sessionType: 'setup',
    });
  }
}

/**
 * Quentli - Core class for handling Quentli payment and setup sessions
 *
 * Manages the communication between merchant site and Quentli checkout/setup pages
 * using MessageChannel API for secure credential transfer.
 *
 * @example
 * ```typescript
 * const quentli = new Quentli();
 *
 * // Payment sessions
 * await quentli.paymentSessions.displayPopup({
 *   url: paymentUrl,
 *   session: { accessToken: '...', csrfToken: '...' },
 *   onComplete: (data) => console.log('Payment completed:', data),
 * });
 *
 * // Setup sessions
 * await quentli.setupSessions.displayPopup({
 *   url: setupUrl,
 *   session: { accessToken: '...', csrfToken: '...' },
 *   onPaymentMethodAdded: (data) => console.log('Payment method added:', data),
 * });
 * ```
 */
export class Quentli {
  private messageChannel: MessageChannel | null = null;
  private popupWindow: Window | null = null;
  private iframeElement: HTMLIFrameElement | null = null;
  private messageHandler: ((event: MessageEvent) => void) | null = null;
  private popupCheckInterval: number | null = null;
  private authSession: QuentliAuthSession | null = null;
  private expectedOrigin: string | null = null;
  private logger: Logger;
  private isDestroyed = false;
  private _paymentSessions: PaymentSessions;
  private _setupSessions: SetupSessions;
  private sessionType: 'payment' | 'setup' | null = null;

  constructor(config: QuentliConfig = {}) {
    this.logger = new Logger(config.debug, "[Quentli]");
    this._paymentSessions = new PaymentSessions(this);
    this._setupSessions = new SetupSessions(this);
    this.logger.log("Quentli initialized");
  }

  /**
   * Access payment session display methods
   *
   * @example
   * ```typescript
   * quentli.paymentSessions.displayPopup({ ... })
   * quentli.paymentSessions.displayEmbedded({ ... })
   * quentli.paymentSessions.displayPage({ ... })
   * ```
   */
  get paymentSessions(): PaymentSessions {
    if (this.isDestroyed) {
      throw new Error("Quentli instance has been destroyed");
    }
    return this._paymentSessions;
  }

  /**
   * Access setup session display methods
   *
   * @example
   * ```typescript
   * quentli.setupSessions.displayPopup({ ... })
   * quentli.setupSessions.displayEmbedded({ ... })
   * quentli.setupSessions.displayPage({ ... })
   * ```
   */
  get setupSessions(): SetupSessions {
    if (this.isDestroyed) {
      throw new Error("Quentli instance has been destroyed");
    }
    return this._setupSessions;
  }

  /**
   * Initialize a session (payment or setup)
   * @internal
   */
  async initSession(options: any): Promise<any> {
    if (this.isDestroyed) {
      throw new Error("Quentli instance has been destroyed");
    }

    this.sessionType = options.sessionType;
    const sessionName = this.sessionType === 'payment' ? 'payment' : 'setup';
    this.logger.log(`Initiating ${sessionName} session in ${options.displayMode} mode`);

    // Extract and store expected origin from the URL
    try {
      const urlObj = new URL(options.url);
      this.expectedOrigin = urlObj.origin;
      this.logger.log("Expected origin set to:", this.expectedOrigin);
    } catch (error) {
      const err = new Error("Invalid URL provided");
      this.logger.error("Failed to parse URL:", error);
      options.onError?.(err);
      throw err;
    }

    // Store session for later use
    this.authSession = options.session;

    // Prepare callbacks for this session
    const callbacks: SessionCallbacks = {
      onComplete: options.onComplete || options.onPaymentMethodAdded,
      onCancel: options.onCancel,
      onError: options.onError,
    };

    // Set up message listener with callbacks
    this.setupMessageListener(callbacks);

    // Handle based on display mode
    switch (options.displayMode) {
      case 'popup':
        return this.handlePopup(options, callbacks);
      case 'iframe':
        return this.handleIframe(options, callbacks);
      case 'redirect':
        return this.handleRedirect(options);
      default:
        throw new Error(`Unknown display mode: ${options.displayMode}`);
    }
  }

  /**
   * Set up the global message listener for postMessage events
   */
  private setupMessageListener(callbacks: SessionCallbacks): void {
    this.messageHandler = (event: MessageEvent) => {
      // Validate origin matches the expected checkout URL origin
      if (this.expectedOrigin && event.origin !== this.expectedOrigin) {
        this.logger.warn(
          "Received message from unexpected origin:",
          event.origin
        );
        return;
      }

      const message = event.data as QuentliMessage;

      if (!message || !message.type) {
        return;
      }

      this.logger.log("Received message:", message.type);

      switch (message.type) {
        case "READY":
          this.handleReady(event, callbacks);
          break;
        case "PAYMENT_COMPLETED":
          if (this.sessionType === 'payment') {
            this.handleCompletion(event, callbacks);
          }
          break;
        case "PAYMENT_METHOD_ADDED":
          if (this.sessionType === 'setup') {
            this.handleCompletion(event, callbacks);
          }
          break;
        default:
          this.logger.warn("Unknown message type:", message.type);
      }
    };

    window.addEventListener("message", this.messageHandler);
  }

  /**
   * Handle READY message from checkout/setup page
   * Initiates the secure credential transfer via MessageChannel
   */
  private handleReady(
    event: MessageEvent,
    callbacks: SessionCallbacks
  ): void {
    this.logger.log("Handling READY event");

    const targetWindow = this.popupWindow || this.iframeElement?.contentWindow;

    if (!targetWindow) {
      this.logger.error("No target window available");
      return;
    }

    if (!this.authSession) {
      this.logger.error("No auth session available");
      return;
    }

    try {
      // Create a new MessageChannel for secure communication
      this.messageChannel = new MessageChannel();

      // Listen for messages on port1
      this.messageChannel.port1.onmessage = (e: MessageEvent) => {
        const message = e.data as QuentliMessage;
        this.logger.log("Received message on MessageChannel:", message.type);

        if (message.type === "PAYMENT_COMPLETED" && this.sessionType === 'payment') {
          this.handleCompletion(e, callbacks);
        } else if (message.type === "PAYMENT_METHOD_ADDED" && this.sessionType === 'setup') {
          this.handleCompletion(e, callbacks);
        }
      };

      // Send credentials and transfer port2 to the payment/setup window
      targetWindow.postMessage(
        {
          type: "INIT",
          accessToken: this.authSession.accessToken,
          csrfToken: this.authSession.csrfToken,
        },
        event.origin,
        [this.messageChannel.port2] // Transfer port2
      );

      this.logger.log("Sent INIT message with credentials");
    } catch (error) {
      this.logger.error("Error handling READY:", error);
      callbacks.onError?.(
        error instanceof Error
          ? error
          : new Error("Failed to initialize session")
      );
    }
  }

  /**
   * Handle completion message (PAYMENT_COMPLETED or PAYMENT_METHOD_ADDED)
   */
  private handleCompletion(
    event: MessageEvent,
    callbacks: SessionCallbacks
  ): void {
    const message = event.data as QuentliMessage;
    
    if (this.sessionType === 'payment') {
      this.logger.log("Payment completed with status:", message.status);
      const status = message.status as PaymentStatus;

      if (status === "COMPLETE") {
        if (!callbacks.onComplete) {
          this.logger.log("No onComplete callback provided");
        }
        callbacks.onComplete?.({
          status,
          paymentSessionId: message.paymentSessionId as string | undefined,
          ...message,
        } as PaymentCompletionData);
        
        // Clean up all resources
        this.cleanup();
        
      } else if (status === "CANCELED") {
        callbacks.onCancel?.();
        
        // Clean up all resources
        this.cleanup();
      }
    } else if (this.sessionType === 'setup') {
      this.logger.log("Payment method added:", message.paymentMethod);
      
      if (!callbacks.onComplete) {
        this.logger.log("No onPaymentMethodAdded callback provided");
      }
      
      callbacks.onComplete?.({
        paymentMethod: message.paymentMethod,
        ...message,
      } as PaymentMethodAddedData);
      
      // Clean up all resources
      this.cleanup();
    }
  }

  /**
   * Handle popup display mode
   */
  private async handlePopup(
    options: any,
    callbacks: SessionCallbacks
  ): Promise<void> {
    const width = options.width || 500;
    const height = options.height || 700;
    const { left, top } = calculatePopupPosition(width, height);
    const features = generateWindowFeatures(width, height, left, top);

    try {
      this.popupWindow = window.open(
        options.url,
        options.windowName || `quentli_${this.sessionType}_session`,
        features
      );

      if (!this.popupWindow) {
        throw new Error(
          "Failed to open popup window. Please allow popups for this site."
        );
      }

      // Poll for popup close
      this.popupCheckInterval = window.setInterval(() => {
        if (this.popupWindow?.closed) {
          this.logger.log("Popup window closed by user");
          callbacks.onCancel?.();
          this.cleanup();
        }
      }, 500);

      this.logger.log("Popup opened successfully");
    } catch (error) {
      this.logger.error("Error opening popup:", error);
      const err =
        error instanceof Error
          ? error
          : new Error("Failed to open popup window");
      callbacks.onError?.(err);
      throw err;
    }
  }

  /**
   * Handle iframe display mode
   */
  private async handleIframe(
    options: any,
    callbacks: SessionCallbacks
  ): Promise<HTMLIFrameElement> {
    try {
      const iframe = document.createElement("iframe");
      iframe.src = options.url;
      iframe.style.border = "none";
      iframe.style.width = options.width || "100%";
      iframe.style.height = options.height || "600px";
      iframe.allow = options.allow || "payment";

      if (options.className) {
        iframe.className = options.className;
      }

      // Remove all existing children from target
      while (options.target.firstChild) {
        try {
          options.target.removeChild(options.target.firstChild);
        } catch (error) {
          this.logger.error("Error removing iframe child:", error);
        }
      }

      options.target.appendChild(iframe);
      this.iframeElement = iframe;

      this.logger.log("Iframe created and appended successfully");

      return iframe;
    } catch (error) {
      this.logger.error("Error opening iframe:", error);
      const err =
        error instanceof Error ? error : new Error("Failed to open iframe");
      callbacks.onError?.(err);
      throw err;
    }
  }

  /**
   * Handle redirect display mode
   */
  private handleRedirect(options: any): void {
    this.logger.log("Redirecting to:", options.url);
    window.location.href = options.url;
  }

  /**
   * @internal
   * Internal handler for redirect display - called from PaymentSessions and SetupSessions
   */
  handleRedirectInternal(options: any): void {
    if (this.isDestroyed) {
      throw new Error("Quentli instance has been destroyed");
    }

    this.logger.log("Redirecting to page");
    return this.handleRedirect(options);
  }

  /**
   * Clean up windows, iframes, and intervals
   */
  public cleanup(): void {
    this.logger.log("Cleaning up resources");

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

    // Remove message listener
    if (this.messageHandler) {
      window.removeEventListener("message", this.messageHandler);
      this.messageHandler = null;
    }

    // Clear auth session
    this.authSession = null;

    // Clear expected origin
    this.expectedOrigin = null;

    // Clear session type
    this.sessionType = null;
  }

  /**
   * Destroy the Quentli instance and clean up all resources
   * Call this when you're done using the instance
   */
  destroy(): void {
    if (this.isDestroyed) {
      return;
    }

    this.logger.log("Destroying Quentli instance");

    this.cleanup();

    this.isDestroyed = true;
  }

  /**
   * Check if the instance has been destroyed
   */
  isActive(): boolean {
    return !this.isDestroyed;
  }
}
