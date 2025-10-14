/**
 * @quentli/js - Official JavaScript SDK for Quentli Payment Sessions
 * 
 * This package provides a simple and secure way to integrate Quentli payment sessions
 * into your web application. It handles the complexity of MessageChannel communication,
 * window management, and secure credential transfer.
 * 
 * @packageDocumentation
 */

export { Quentli } from './Quentli';

export type {
  QuentliConfig,
  QuentliSession,
  PaymentStatus,
  DisplayMode,
  PaymentCompletionData,
  InitiatePaymentSessionOptions,
  PopupPaymentSessionOptions,
  IframePaymentSessionOptions,
  RedirectPaymentSessionOptions,
  QuentliMessageType,
  QuentliMessage,
} from './types';

// Re-export utilities for advanced use cases
export {
  calculatePopupPosition,
  generateWindowFeatures,
  Logger,
} from './utils';

