// Debug mode can be enabled/disabled
export const DEBUG_MODE = true

export function debugLog(component: string, message: string, data?: any) {
  if (DEBUG_MODE) {
    console.log(`[DEBUG][${component}] ${message}`, data ? data : "")
  }
}

export function debugError(component: string, message: string, error?: any) {
  if (DEBUG_MODE) {
    console.error(`[ERROR][${component}] ${message}`, error ? error : "")
  }
}
