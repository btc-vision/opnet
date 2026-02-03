import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { IJsonThreader } from '../src/threading/JSONThreader.js';

describe('React Native Threading', () => {
    describe('SequentialJsonThreader', () => {
        let threader: IJsonThreader;

        beforeEach(async () => {
            const { SequentialJsonThreader } = await import(
                '../src/threading/JSONThreader.sequential.js'
            );
            SequentialJsonThreader.resetInstance();
            threader = SequentialJsonThreader.getInstance();
        });

        afterEach(async () => {
            await threader.terminate();
        });

        describe('parse', () => {
            it('should parse valid JSON', async () => {
                const result = await threader.parse<{ foo: string }>(
                    '{"foo": "bar"}',
                );
                expect(result).toEqual({ foo: 'bar' });
            });

            it('should parse arrays', async () => {
                const result = await threader.parse<number[]>('[1, 2, 3]');
                expect(result).toEqual([1, 2, 3]);
            });

            it('should parse nested objects', async () => {
                const json = '{"a": {"b": {"c": 123}}}';
                const result = await threader.parse<{ a: { b: { c: number } } }>(json);
                expect(result.a.b.c).toBe(123);
            });

            it('should throw on invalid JSON', async () => {
                await expect(threader.parse('invalid')).rejects.toThrow();
            });

            it('should increment processed count on success', async () => {
                const before = threader.stats.processed;
                await threader.parse('{"x": 1}');
                expect(threader.stats.processed).toBe(before + 1);
            });

            it('should increment failed count on error', async () => {
                const before = threader.stats.failed;
                try {
                    await threader.parse('invalid');
                } catch {
                    // expected
                }
                expect(threader.stats.failed).toBe(before + 1);
            });
        });

        describe('parseBuffer', () => {
            it('should parse JSON from ArrayBuffer', async () => {
                const json = '{"buffer": true}';
                const buffer = new TextEncoder().encode(json).buffer;
                const result = await threader.parseBuffer<{ buffer: boolean }>(buffer);
                expect(result).toEqual({ buffer: true });
            });

            it('should handle UTF-8 content', async () => {
                const json = '{"emoji": "🚀", "unicode": "日本語"}';
                const buffer = new TextEncoder().encode(json).buffer;
                const result = await threader.parseBuffer<{
                    emoji: string;
                    unicode: string;
                }>(buffer);
                expect(result.emoji).toBe('🚀');
                expect(result.unicode).toBe('日本語');
            });
        });

        describe('stringify', () => {
            it('should stringify objects', async () => {
                const result = await threader.stringify({ foo: 'bar' });
                expect(result).toBe('{"foo":"bar"}');
            });

            it('should stringify arrays', async () => {
                const result = await threader.stringify([1, 2, 3]);
                expect(result).toBe('[1,2,3]');
            });

            it('should stringify nested structures', async () => {
                const result = await threader.stringify({
                    a: { b: [1, 2, { c: 3 }] },
                });
                expect(JSON.parse(result)).toEqual({ a: { b: [1, 2, { c: 3 }] } });
            });

            it('should handle null and booleans', async () => {
                expect(await threader.stringify(null)).toBe('null');
                expect(await threader.stringify(true)).toBe('true');
                expect(await threader.stringify(false)).toBe('false');
            });
        });

        describe('stats', () => {
            it('should report zero workers (sequential has none)', () => {
                expect(threader.stats.total).toBe(0);
                expect(threader.stats.available).toBe(0);
                expect(threader.stats.pending).toBe(0);
                expect(threader.stats.queued).toBe(0);
            });

            it('should track processed tasks', async () => {
                await threader.parse('{}');
                await threader.stringify({});
                await threader.parseBuffer(new TextEncoder().encode('[]').buffer);
                expect(threader.stats.processed).toBeGreaterThanOrEqual(3);
            });
        });

        describe('singleton pattern', () => {
            it('should return same instance', async () => {
                const { SequentialJsonThreader } = await import(
                    '../src/threading/JSONThreader.sequential.js'
                );
                const instance1 = SequentialJsonThreader.getInstance();
                const instance2 = SequentialJsonThreader.getInstance();
                expect(instance1).toBe(instance2);
            });

            it('should create new instance after reset', async () => {
                const { SequentialJsonThreader } = await import(
                    '../src/threading/JSONThreader.sequential.js'
                );
                const instance1 = SequentialJsonThreader.getInstance();
                SequentialJsonThreader.resetInstance();
                const instance2 = SequentialJsonThreader.getInstance();
                expect(instance1).not.toBe(instance2);
            });
        });
    });

    describe('WorkletJsonThreader', () => {
        let threader: IJsonThreader;

        beforeEach(async () => {
            // Mock react-native-worklets
            vi.doMock('react-native-worklets', () => ({
                createWorkletRuntime: vi.fn((name: string) => ({ name })),
                runOnRuntime: vi.fn(
                    async <T>(_runtime: unknown, fn: () => T): Promise<T> => {
                        // Execute the worklet function directly (simulating worklet execution)
                        return fn();
                    },
                ),
            }));

            const { WorkletJsonThreader } = await import(
                '../src/threading/JSONThreader.worklet.js'
            );
            WorkletJsonThreader.resetInstance();
            threader = WorkletJsonThreader.getInstance();
        });

        afterEach(async () => {
            await threader.terminate();
            vi.doUnmock('react-native-worklets');
        });

        describe('parse (below threshold - direct execution)', () => {
            it('should parse small JSON directly', async () => {
                const result = await threader.parse<{ small: boolean }>(
                    '{"small": true}',
                );
                expect(result).toEqual({ small: true });
            });
        });

        describe('stringify (below threshold - direct execution)', () => {
            it('should stringify small objects directly', async () => {
                const result = await threader.stringify({ small: true });
                expect(result).toBe('{"small":true}');
            });
        });

        describe('stats', () => {
            it('should report initial state', () => {
                const stats = threader.stats;
                expect(stats.pending).toBe(0);
                expect(stats.queued).toBe(0);
                expect(stats.processed).toBeGreaterThanOrEqual(0);
            });
        });

        describe('singleton pattern', () => {
            it('should return same instance', async () => {
                const { WorkletJsonThreader } = await import(
                    '../src/threading/JSONThreader.worklet.js'
                );
                const instance1 = WorkletJsonThreader.getInstance();
                const instance2 = WorkletJsonThreader.getInstance();
                expect(instance1).toBe(instance2);
            });
        });
    });

    describe('index.react-native.ts entry point', () => {
        beforeEach(() => {
            vi.doMock('react-native-worklets', () => ({
                createWorkletRuntime: vi.fn((name: string) => ({ name })),
                runOnRuntime: vi.fn(async <T>(_: unknown, fn: () => T) => fn()),
            }));
        });

        afterEach(() => {
            vi.doUnmock('react-native-worklets');
        });

        it('should export createJsonThreader', async () => {
            const { createJsonThreader } = await import(
                '../src/threading/index.react-native.js'
            );
            expect(typeof createJsonThreader).toBe('function');
        });

        it('should export IJsonThreader type', async () => {
            const module = await import('../src/threading/index.react-native.js');
            expect(module.createJsonThreader).toBeDefined();
        });
    });

    describe('createJsonThreader factory (React Native)', () => {
        beforeEach(() => {
            vi.resetModules();
        });

        afterEach(() => {
            vi.doUnmock('react-native-worklets');
        });

        it('should return WorkletJsonThreader when worklets available', async () => {
            vi.doMock('react-native-worklets', () => ({
                createWorkletRuntime: vi.fn((name: string) => ({ name })),
                runOnRuntime: vi.fn(async <T>(_: unknown, fn: () => T) => fn()),
            }));

            const { createJsonThreader } = await import(
                '../src/threading/index.react-native.js'
            );
            const { WorkletJsonThreader } = await import(
                '../src/threading/JSONThreader.worklet.js'
            );

            WorkletJsonThreader.resetInstance();
            const threader = await createJsonThreader();

            expect(threader).toBeInstanceOf(WorkletJsonThreader);
            await threader.terminate();
        });

        it('should fallback to SequentialJsonThreader when worklets unavailable', async () => {
            vi.doMock('react-native-worklets', () => {
                throw new Error('Module not found');
            });

            // Need fresh imports after mocking
            vi.resetModules();

            const { createJsonThreader } = await import(
                '../src/threading/index.react-native.js'
            );
            const { SequentialJsonThreader } = await import(
                '../src/threading/JSONThreader.sequential.js'
            );

            SequentialJsonThreader.resetInstance();
            const threader = await createJsonThreader();

            expect(threader).toBeInstanceOf(SequentialJsonThreader);
            await threader.terminate();
        });
    });

    describe('IJsonThreader interface compliance', () => {
        const implementations = [
            {
                name: 'SequentialJsonThreader',
                getThreader: async () => {
                    const { SequentialJsonThreader } = await import(
                        '../src/threading/JSONThreader.sequential.js'
                    );
                    SequentialJsonThreader.resetInstance();
                    return SequentialJsonThreader.getInstance();
                },
            },
        ];

        for (const { name, getThreader } of implementations) {
            describe(`${name} implements IJsonThreader`, () => {
                let threader: IJsonThreader;

                beforeEach(async () => {
                    threader = await getThreader();
                });

                afterEach(async () => {
                    await threader.terminate();
                });

                it('should have stats property', () => {
                    expect(threader.stats).toBeDefined();
                    expect(typeof threader.stats.pending).toBe('number');
                    expect(typeof threader.stats.queued).toBe('number');
                    expect(typeof threader.stats.available).toBe('number');
                    expect(typeof threader.stats.total).toBe('number');
                    expect(typeof threader.stats.processed).toBe('number');
                    expect(typeof threader.stats.failed).toBe('number');
                });

                it('should have parse method', () => {
                    expect(typeof threader.parse).toBe('function');
                });

                it('should have parseBuffer method', () => {
                    expect(typeof threader.parseBuffer).toBe('function');
                });

                it('should have stringify method', () => {
                    expect(typeof threader.stringify).toBe('function');
                });

                it('should have fetch method', () => {
                    expect(typeof threader.fetch).toBe('function');
                });

                it('should have terminate method', () => {
                    expect(typeof threader.terminate).toBe('function');
                });
            });
        }
    });

    describe('Large JSON handling', () => {
        it('SequentialJsonThreader should handle large JSON', async () => {
            const { SequentialJsonThreader } = await import(
                '../src/threading/JSONThreader.sequential.js'
            );
            SequentialJsonThreader.resetInstance();
            const threader = SequentialJsonThreader.getInstance();

            // Create large JSON (> 16KB threshold)
            const largeArray = Array.from({ length: 5000 }, (_, i) => ({
                id: i,
                name: `Item ${i}`,
                data: 'x'.repeat(100),
            }));

            const json = JSON.stringify(largeArray);
            expect(json.length).toBeGreaterThan(16_384);

            const parsed = await threader.parse<typeof largeArray>(json);
            expect(parsed.length).toBe(5000);
            expect(parsed[0]!.id).toBe(0);
            expect(parsed[4999]!.id).toBe(4999);

            const stringified = await threader.stringify(parsed);
            expect(stringified).toBe(json);

            await threader.terminate();
        });
    });
});
