/**
 * @quentli/js - Official JavaScript SDK for Quentli Payment Sessions
 * 
 * This package provides a simple and secure way to integrate Quentli payment sessions
 * into your web application. It handles the complexity of MessageChannel communication,
 * window management, and secure credential transfer.
 * 
 * @packageDocumentation
 */

export { Quentli, PaymentSessions, SetupSessions } from './Quentli';

export type {
  QuentliConfig,
  QuentliAuthSession as QuentliSession,
  PaymentStatus,
  DisplayMode,
  PaymentCompletionData,
  PaymentMethodData,
  PaymentMethodAddedData,
  DisplayPopupOptions,
  DisplayEmbeddedOptions,
  DisplayPageOptions,
  SetupSessionDisplayPopupOptions,
  SetupSessionDisplayEmbeddedOptions,
  SetupSessionDisplayPageOptions,
  QuentliMessageType,
  QuentliMessage,
} from './types';

// Re-export utilities for advanced use cases
export {
  calculatePopupPosition,
  generateWindowFeatures,
  Logger,
} from './utils';

