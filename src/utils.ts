/**
 * Utility functions for window and iframe management
 */

/**
 * Calculate centered position for popup window
 */
export function calculatePopupPosition(width: number, height: number): { left: number; top: number } {
  const left = Math.max(0, (window.screen.width - width) / 2);
  const top = Math.max(0, (window.screen.height - height) / 2);
  return { left, top };
}

/**
 * Generate window features string for window.open()
 */
export function generateWindowFeatures(
  width: number,
  height: number,
  left: number,
  top: number
): string {
  return [
    `width=${width}`,
    `height=${height}`,
    `left=${left}`,
    `top=${top}`,
    'toolbar=no',
    'menubar=no',
    'scrollbars=yes',
    'resizable=yes',
    'status=no'
  ].join(',');
}

/**
 * Debug logger
 */
export class Logger {
  constructor(private enabled: boolean = false, private prefix: string = '[Quentli]') {}

  log(...args: unknown[]) {
    if (this.enabled) {
      console.log(this.prefix, ...args);
    }
  }

  warn(...args: unknown[]) {
    if (this.enabled) {
      console.warn(this.prefix, ...args);
    }
  }

  error(...args: unknown[]) {
    if (this.enabled) {
      console.error(this.prefix, ...args);
    }
  }
}

/**
 * Validation utilities for runtime argument checking
 */

/**
 * Validate that a URL string is provided and valid
 */
export function validateUrl(url: unknown, paramName: string = 'url'): string {
  if (!url || typeof url !== 'string') {
    throw new Error(`${paramName} is required and must be a string`);
  }
  
  if (url.trim().length === 0) {
    throw new Error(`${paramName} cannot be empty`);
  }

  // Validate URL format
  try {
    new URL(url);
  } catch {
    throw new Error(`${paramName} must be a valid URL`);
  }

  return url;
}

/**
 * Validate that session credentials are provided
 */
export function validateSession(session: unknown): void {
  if (!session || typeof session !== 'object') {
    throw new Error('session is required and must be an object');
  }

  const sess = session as Record<string, unknown>;

  if (!sess.accessToken || typeof sess.accessToken !== 'string') {
    throw new Error('session.accessToken is required and must be a string');
  }

  if (sess.accessToken.trim().length === 0) {
    throw new Error('session.accessToken cannot be empty');
  }

  if (!sess.csrfToken || typeof sess.csrfToken !== 'string') {
    throw new Error('session.csrfToken is required and must be a string');
  }

  if (sess.csrfToken.trim().length === 0) {
    throw new Error('session.csrfToken cannot be empty');
  }
}

/**
 * Validate that target element is provided and is an HTMLElement
 */
export function validateTarget(target: unknown): void {
  if (!target) {
    throw new Error('target is required');
  }

  if (typeof HTMLElement !== 'undefined' && !(target instanceof HTMLElement)) {
    throw new Error('target must be an HTMLElement');
  }
}

