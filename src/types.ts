/**
 * Payment session credentials returned from the Quentli API
 */
export interface QuentliAuthSession {
  accessToken: string;
  csrfToken: string;
  expiresAt?: string;
}

/**
 * Payment status values
 */
export type PaymentStatus = "COMPLETE" | "CANCELED";

/**
 * Display mode for payment sessions
 */
export type DisplayMode = "popup" | "iframe" | "redirect";

/**
 * Payment completion data
 */
export interface PaymentCompletionData {
  status: PaymentStatus;
  paymentSessionId?: string;
  [key: string]: unknown;
}

/**
 * Payment method data
 */
export interface PaymentMethodData {
  id: string;
  type: string;
}

/**
 * Payment method added data
 */
export interface PaymentMethodAddedData {
  paymentMethod: PaymentMethodData;
  [key: string]: unknown;
}

/**
 * Configuration options for Quentli instance
 */
export interface QuentliConfig {
  /**
   * Optional: Enable debug logging
   */
  debug?: boolean;
}

/**
 * Base options shared across display modes that need callbacks
 */
interface BasePaymentSessionOptions {
  /**
   * Payment session URL from Quentli API
   */
  url: string;

  /**
   * Payment session credentials
   */
  session: QuentliAuthSession;

  /**
   * Callback invoked when payment is completed successfully
   */
  onComplete?: (data: PaymentCompletionData) => void;

  /**
   * Callback invoked when payment is canceled by the user
   */
  onCancel?: () => void;

  /**
   * Callback invoked when an error occurs
   */
  onError?: (error: Error) => void;
}

/**
 * Options for displayPopup method
 */
export interface DisplayPopupOptions extends BasePaymentSessionOptions {
  /**
   * Popup window width in pixels
   * @default 500
   */
  width?: number;
  /**
   * Popup window height in pixels
   * @default 700
   */
  height?: number;
  /**
   * Optional: Custom window name
   */
  windowName?: string;
}

/**
 * Options for displayEmbedded method
 */
export interface DisplayEmbeddedOptions extends BasePaymentSessionOptions {
  /**
   * Target element to append iframe to
   */
  target: HTMLElement;
  /**
   * Iframe width
   * @default '100%'
   */
  width?: string;
  /**
   * Iframe height
   * @default '600px'
   */
  height?: string;
  /**
   * Optional: Additional iframe CSS class
   */
  className?: string;
  /**
   * Optional: iframe allow attribute
   * @default 'payment'
   */
  allow?: string;
}

/**
 * Options for displayPage method
 */
export interface DisplayPageOptions {
  /**
   * Payment session URL from Quentli API
   */
  url: string;
}

/**
 * Base options shared across setup session display modes that need callbacks
 */
interface BaseSetupSessionOptions {
  /**
   * Setup session URL from Quentli API
   */
  url: string;

  /**
   * Setup session credentials
   */
  session: QuentliAuthSession;

  /**
   * Callback invoked when payment method is added successfully
   */
  onPaymentMethodAdded?: (data: PaymentMethodAddedData) => void;

  /**
   * Callback invoked when setup is canceled by the user
   */
  onCancel?: () => void;

  /**
   * Callback invoked when an error occurs
   */
  onError?: (error: Error) => void;
}

/**
 * Options for setup session displayPopup method
 */
export interface SetupSessionDisplayPopupOptions extends BaseSetupSessionOptions {
  /**
   * Popup window width in pixels
   * @default 500
   */
  width?: number;
  /**
   * Popup window height in pixels
   * @default 700
   */
  height?: number;
  /**
   * Optional: Custom window name
   */
  windowName?: string;
}

/**
 * Options for setup session displayEmbedded method
 */
export interface SetupSessionDisplayEmbeddedOptions extends BaseSetupSessionOptions {
  /**
   * Target element to append iframe to
   */
  target: HTMLElement;
  /**
   * Iframe width
   * @default '100%'
   */
  width?: string;
  /**
   * Iframe height
   * @default '600px'
   */
  height?: string;
  /**
   * Optional: Additional iframe CSS class
   */
  className?: string;
  /**
   * Optional: iframe allow attribute
   * @default 'payment'
   */
  allow?: string;
}

/**
 * Options for setup session displayPage method
 */
export interface SetupSessionDisplayPageOptions {
  /**
   * Setup session URL from Quentli API
   */
  url: string;
}

/**
 * Internal message types for postMessage communication
 */
export type QuentliMessageType = "READY" | "INIT" | "PAYMENT_COMPLETED" | "PAYMENT_METHOD_ADDED";

/**
 * Message structure for postMessage communication
 */
export interface QuentliMessage {
  type: QuentliMessageType;
  status?: PaymentStatus;
  accessToken?: string;
  csrfToken?: string;
  paymentMethod?: PaymentMethodData;
  [key: string]: unknown;
}
