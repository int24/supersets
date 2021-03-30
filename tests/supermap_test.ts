import {
    equal,
    assertEquals,
    assertStrictEquals
} from 'https://deno.land/std@0.91.0/testing/asserts.ts'

import { Supermap } from '../mod.ts'

Deno.test('supermap: basic map operations', () => {
    const map = new Supermap()
    map.set('a', 1)
    map.set('b', 1)
    assertEquals(map.size, 2)
    assertEquals(map.has('a'), true)
    assertStrictEquals(map.get('a'), 1)
    map.delete('a')
    assertEquals(map.size, 1)
    assertEquals(map.has('a'), false)
    assertStrictEquals(map.get('a'), undefined)
    map.clear()
    assertEquals(map.size, 0)
})

Deno.test('supermap: convert to array/keyArray', () => {
    const map = new Supermap()
    map.set('a', 1)
    map.set('b', 2)
    const array1 = map.array()
    const keyArray1 = map.keyArray()
    equal(array1, [1, 2])
    equal(keyArray1, ['a', 'b'])
    assertEquals(array1 === map.array(), true)
    assertEquals(keyArray1 === map.keyArray(), true)
    map.set('c', 3)
    const array2 = map.array()
    const keyArray2 = map.keyArray()
    equal(array2, [1, 2, 3])
    equal(keyArray2, ['a', 'b', 'c'])
    assertEquals(array2 === map.array(), true)
    assertEquals(keyArray2 === map.keyArray(), true)
})
