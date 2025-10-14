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

