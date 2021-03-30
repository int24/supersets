import {
    equal,
    assertEquals,
    assertStrictEquals,
    assertArrayIncludes
} from 'https://deno.land/std@0.91.0/testing/asserts.ts'

import { Superset } from '../mod.ts'

type TestSuperset = Superset<number>

Deno.test('superset: basic set operations', () => {
    const set: TestSuperset = new Superset()
    set.add(1)
    set.add(2)
    assertEquals(set.size, 2)
    assertEquals(set.has(1), true)
    assertEquals(set.has(2), true)
    set.delete(1)
    assertEquals(set.size, 1)
    assertEquals(set.has(1), false)
    set.clear()
    assertEquals(set.size, 0)
})

Deno.test('superset: convert to array', () => {
    const set: TestSuperset = new Superset()
    set.add(1)
    set.add(2)
    const array1 = set.array()
    equal(array1, [1, 2])
    assertEquals(array1 === set.array(), true)
    set.add(3)
    const array2 = set.array()
    equal(array2, [1, 2, 3])
    assertEquals(array2 === set.array(), true)
})

Deno.test('superset: get first/last values', () => {
    const set: TestSuperset = new Superset()
    set.add(1)
    set.add(2)
    set.add(3)
    assertEquals(set.first(), 1)
    assertEquals(set.first(-1), 3)
    equal(set.first(3), [1, 2, 3])
    equal(set.first(-3), [1, 2, 3])
    assertEquals(set.last(), 3)
    assertEquals(set.last(-1), 1)
    equal(set.last(3), [1, 2, 3])
    equal(set.last(-3), [1, 2, 3])
})

Deno.test('superset: get random values', () => {
    const set: TestSuperset = new Superset()
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    for (let i = 0; i < numbers.length; i++) set.add(numbers[i])
    assertArrayIncludes(numbers, [set.random()])
    assertArrayIncludes(numbers, [set.random(1)])
    assertArrayIncludes(numbers, set.random(5))
    set.clear()
    assertStrictEquals(set.random(), undefined)
    equal(set.random(5), [])
})

Deno.test('superset: find an item by value', () => {
    const set: TestSuperset = new Superset()
    set.add(1)
    set.add(2)
    const findVal = set.find(v => v === 1)
    const findUnknownVal = set.find(v => v === 3)
    assertStrictEquals(findVal, 1)
    assertStrictEquals(findUnknownVal, undefined)
})

Deno.test('superset: sweep items', () => {
    const set: TestSuperset = new Superset()
    set.add(1)
    set.add(2)
    set.add(3)
    const sweep1 = set.sweep(x => x === 2)
    assertStrictEquals(sweep1, 1)
    equal(set.array(), [1, 3])
    const sweep2 = set.sweep(x => x === 4)
    assertStrictEquals(sweep2, 0)
    equal(set.array(), [1, 3])
})

Deno.test('superset: filter items', () => {
    const set: TestSuperset = new Superset()
    set.add(1)
    set.add(2)
    set.add(3)
    const filtered = set.filter(x => x > 1)
    assertStrictEquals(filtered.size, 2)
    equal(filtered, [2, 3])
})

Deno.test('superset: partition items', () => {
    const set: TestSuperset = new Superset()
    set.add(1)
    set.add(2)
    set.add(3)
    const [part1, part2] = set.partition(x => x > 1)
    assertStrictEquals(part1.size, 2)
    assertStrictEquals(part2.size, 1)
    equal(part1, [2, 3])
    equal(part2, [1])
})

Deno.test('superset: set items', () => {
    const set: TestSuperset = new Superset()
    set.add(1)
    set.add(2)
    set.add(3)
    const mapped = set.map(x => x + 1)
    equal(mapped.array(), [2, 3, 4])
})

Deno.test('superset: test items with some', () => {
    const set: TestSuperset = new Superset()
    set.add(1)
    set.add(2)
    set.add(3)
    const match = set.some(x => x === 1)
    const matchUnknown = set.some(x => x === 4)
    assertStrictEquals(match, true)
    assertStrictEquals(matchUnknown, false)
})

Deno.test('superset: test items with every', () => {
    const set: TestSuperset = new Superset()
    set.add(1)
    set.add(2)
    set.add(3)
    const match = set.every(x => x > 0)
    const matchUnknown = set.every(x => x === 1)
    assertStrictEquals(match, true)
    assertStrictEquals(matchUnknown, false)
})

Deno.test('superset: reduce items', () => {
    const set: TestSuperset = new Superset()
    set.add(1)
    set.add(2)
    set.add(3)
    const total = set.reduce((t, v) => t + v, 0)
    assertStrictEquals(total, 1 + 2 + 3)
})

Deno.test('superset: loop with each/forEach', () => {
    const set: TestSuperset = new Superset()
    set.add(1)
    set.add(2)
    set.add(3)
    let total1 = 0
    let total2 = 0
    set.each(x => (total1 += x))
    set.forEach(x => (total2 += x))
    assertStrictEquals(total1, 1 + 2 + 3)
    assertStrictEquals(total2, 1 + 2 + 3)
})

Deno.test('superset: sort items', () => {
    const set: TestSuperset = new Superset()
    set.add(1)
    set.add(2)
    set.add(3)
    const sorted = set.sort((a, b) => b - a)
    assertStrictEquals(sorted === set, true)
    equal(sorted, [3, 2, 1])
    equal(set, [3, 2, 1])
})

Deno.test('superset: clone', () => {
    const set: TestSuperset = new Superset()
    set.add(1)
    set.add(2)
    set.add(3)
    const clonedSet = set.clone()
    equal(set, clonedSet)
})

Deno.test('superset: combine with concat', () => {
    const set1: TestSuperset = new Superset()
    const set2: TestSuperset = new Superset()
    const set3: TestSuperset = new Superset()
    set1.add(1)
    set2.add(2)
    set3.add(3)
    const combined = set1.concat(set2, set3)
    assertStrictEquals(combined.size, 3)
    equal(combined.array(), [1, 2, 3])
})

Deno.test('superset: compare with equals', () => {
    const set1: TestSuperset = new Superset()
    const set2: TestSuperset = new Superset()
    const set3: TestSuperset = new Superset()
    set1.add(1)
    set1.add(2)
    set1.add(3)
    set2.add(1)
    set2.add(2)
    set2.add(3)
    set3.add(1)
    set3.add(3)
    assertEquals(set1.equals(set1), true)
    assertEquals(set1.equals(set2), true)
    assertEquals(set1.equals(set3), false)
})

Deno.test('superset: intersections', () => {
    const set1: TestSuperset = new Superset()
    const set2: TestSuperset = new Superset()
    set1.add(1)
    set1.add(2)
    set1.add(3)
    set2.add(1)
    const intersections = set1.intersect(set2)
    assertStrictEquals(intersections.size, 1)
    equal(intersections.array(), [1])
})

Deno.test('superset: tap', () => {
    const set: TestSuperset = new Superset()
    set.add(1)
    set.add(2)
    set.add(3)
    let total = 0
    set.tap(m => (total = m.size))
    assertStrictEquals(total, set.size)
})
