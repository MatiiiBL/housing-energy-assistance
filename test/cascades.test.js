const assert = require('assert');
const { resolveCascades } = require('../server/cascades.js');

// Test 1: HEAP triggers at least 2 cascades
const heapChains = resolveCascades(['heap_regular']);
assert.ok(heapChains.length >= 2, 'HEAP should trigger at least 2 cascades');

// Test 2: SNAP triggers categorical EAL
const snapChains = resolveCascades(['snap']);
const ealFromSnap = snapChains.find((c) => c.terminalUnlock === 'coned_eal');
assert.ok(ealFromSnap, 'SNAP should unlock Con Edison EAL');

// Test 3: Multi-hop — HEAP → EAL → Solar for All
const multiHop = resolveCascades(['heap_regular']);
const solarChain = multiHop.find((c) => c.terminalUnlock === 'solar_for_all');
assert.ok(solarChain, 'HEAP should reach Solar for All');
assert.strictEqual(solarChain.hopCount, 2, 'HEAP → EAL → Solar should be 2 hops');

// Test 4: No duplicate terminal when SNAP and HEAP both qualify
const combined = resolveCascades(['snap', 'heap_regular']);
const ealCount = combined.filter((c) => c.terminalUnlock === 'coned_eal').length;
assert.ok(ealCount <= 1, 'Con Edison EAL should not appear twice as terminal');

console.log('All cascade tests passed.');
