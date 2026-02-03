/**
 * Threading module (Node.js / Browser entry point).
 *
 * Provides parallel JSON operations using worker threads.
 * - Node.js: Uses worker_threads
 * - Browser: Uses Web Workers with Blob URLs
 *
 * For React Native, the bundler resolves to index.react-native.ts
 * via package.json conditional exports, which provides worklet support.
 *
 * @example
 * ```typescript
 * import { createJsonThreader } from 'opnet/threading';
 *
 * const threader = await createJsonThreader();
 * const data = await threader.parse(largeJsonString);
 * await threader.terminate();
 * ```
 *
 * @packageDocumentation
 */

import type { ThreaderOptions } from './interfaces/IThread.js';
import type { IJsonThreader } from './JSONThreader.js';

// Re-export types and utilities
export type { ThreaderOptions, WorkerScript } from './interfaces/IThread.js';
export type { IJsonThreader, JsonValue, FetchRequest } from './JSONThreader.js';
export { detectRuntime, isNode, isReactNative, isBrowser } from './WorkerCreator.js';

// Export concrete implementations (browser/node only)
export { JsonThreader } from './JSONThreader.js';
export { SequentialJsonThreader } from './JSONThreader.sequential.js';
// Note: WorkletJsonThreader is only exported from index.react-native.ts

/**
 * Creates a JSON threader for Node.js or Browser.
 *
 * Uses worker_threads (Node.js) or Web Workers (Browser) for parallel
 * JSON parsing, stringification, and HTTP fetch.
 *
 * @param options - Optional threader configuration
 * @returns A promise resolving to the initialized JSON threader
 *
 * @example
 * ```typescript
 * import { createJsonThreader } from 'opnet/threading';
 *
 * const threader = await createJsonThreader({ poolSize: 4 });
 * const data = await threader.parse(largeJson);
 * await threader.terminate();
 * ```
 */
export async function createJsonThreader(
    options?: ThreaderOptions & { threadingThreshold?: number },
): Promise<IJsonThreader> {
    // This entry point is for Node.js and Browser only.
    // React Native resolves to index.react-native.ts via package.json exports.
    const { JsonThreader } = await import('./JSONThreader.js');
    return new JsonThreader(options);
}

// Legacy global singleton export (for backward compatibility)
export { jsonThreader, initJsonThreader } from './JSONThreader.js';
