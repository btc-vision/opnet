/**
 * React Native entry point for the threading module.
 *
 * Provides the same public API as the browser/Node.js threading module
 * but uses WorkletJsonThreader (parallel via react-native-worklets)
 * when available, falling back to SequentialJsonThreader (main-thread).
 *
 * @packageDocumentation
 */

import type { ThreaderOptions } from './interfaces/IThread.js';
import type { IJsonThreader } from './JSONThreader.js';

// Re-export types
export type { ThreaderOptions, WorkerScript } from './interfaces/IThread.js';
export type { IJsonThreader, JsonValue, FetchRequest } from './JSONThreader.js';

// Sequential threader (React Native fallback)
export { SequentialJsonThreader } from './JSONThreader.sequential.js';

// Worklet threader (React Native parallel)
export { WorkletJsonThreader } from './JSONThreader.worklet.js';

// Alias for API compatibility — consumers using `JsonThreader` get the sequential version
export { SequentialJsonThreader as JsonThreader } from './JSONThreader.sequential.js';

/**
 * Detects the runtime environment.
 *
 * @returns Always 'react-native' in this entry point.
 */
export function detectRuntime(): 'node' | 'browser' | 'react-native' | 'unknown' {
    return 'react-native';
}

/**
 * Cached result of the worklets availability check.
 */
let workletsAvailable: boolean | null = null;

/**
 * Creates a JSON threader appropriate for React Native.
 *
 * Tries to use WorkletJsonThreader (parallel via react-native-worklets).
 * Falls back to SequentialJsonThreader if worklets are not installed.
 *
 * @param options - Optional threader configuration
 * @returns A promise resolving to the initialized JSON threader
 */
export async function createJsonThreader(
    options?: ThreaderOptions & { threadingThreshold?: number },
): Promise<IJsonThreader> {
    // Check worklets availability (cached after first probe)
    if (workletsAvailable === null) {
        try {
            await import('react-native-worklets' as string);
            workletsAvailable = true;
        } catch {
            workletsAvailable = false;
        }
    }

    if (workletsAvailable) {
        try {
            const { WorkletJsonThreader } = await import('./JSONThreader.worklet.js');
            return WorkletJsonThreader.getInstance(options);
        } catch {
            // Initialization failed (e.g. eval blocked) — fall through
            workletsAvailable = false;
        }
    }

    const { SequentialJsonThreader } = await import('./JSONThreader.sequential.js');
    return SequentialJsonThreader.getInstance(options);
}

/**
 * Global JSON threader singleton for React Native.
 *
 * Uses SequentialJsonThreader by default for sync initialization.
 * Call `initJsonThreader()` at app startup to enable worklet-based threading.
 */
import { SequentialJsonThreader } from './JSONThreader.sequential.js';

const GLOBAL_KEY = Symbol.for('opnet.jsonThreader.reactnative');
const globalObj = (typeof globalThis !== 'undefined' ? globalThis : global) as Record<
    symbol,
    IJsonThreader
>;

if (!globalObj[GLOBAL_KEY]) {
    globalObj[GLOBAL_KEY] = SequentialJsonThreader.getInstance();
}

export const jsonThreader: IJsonThreader = globalObj[GLOBAL_KEY];

/**
 * Initializes the JSON threader with worklet support if available.
 * Call this at app startup for optimal React Native performance.
 *
 * @returns The initialized JSON threader
 */
export async function initJsonThreader(): Promise<IJsonThreader> {
    const threader = await createJsonThreader();
    globalObj[GLOBAL_KEY] = threader;
    return threader;
}
