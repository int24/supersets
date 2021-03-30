export interface SupermapConstructor {
    new (): Supermap<unknown, unknown>
    new <K, V>(entries?: ReadonlyArray<readonly [K, V]> | null): Supermap<K, V>
    new <K, V>(iterable: Iterable<readonly [K, V]>): Supermap<K, V>
    readonly prototype: Supermap<unknown, unknown>
    readonly [Symbol.species]: SupermapConstructor
}

/**
 * An abstraction of useful methods over a JavaScript `Map`.
 *
 * @property {number} size - The amount of elements in this map.
 */
export class Supermap<K, V> extends Map<K, V> {
    private _array: V[] | null = null
    private _keyArray: K[] | null = null

    public ['constructor']: typeof Supermap

    constructor(entries?: ReadonlyArray<readonly [K, V]> | null) {
        super(entries)
    }

    /**
     * Identical to [Map.get()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/get).
     * Gets an element with the specified key, and returns its value, or `undefined` if the element does not exist.
     */
    public get(key: K): V | undefined {
        return super.get(key)
    }

    /**
     * Identical to [Map.set()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/set).
     * Sets a new element in the map with the specified key and value.
     */
    public set(key: K, value: V): this {
        this._array = null
        this._keyArray = null
        return super.set(key, value)
    }

    /**
     * Identical to [Map.delete()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/delete).
     * Deletes an element from the map.
     *
     * @returns `true` if the element was removed, `false` if the element does not exist.
     */
    public delete(key: K): boolean {
        this._array = null
        this._keyArray = null
        return super.delete(key)
    }

    /**
     * Identical to [Map.has()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/has).
     * Checks if an element exists in the map.
     *
     * @returns `true` if the element exists, `false` if it does not exist.
     */
    public has(key: K): boolean {
        return super.has(key)
    }

    /**
     * Identical to [Map.clear()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/clear).
     * Removes all elements from the map.
     */
    public clear(): void {
        this._array = null
        this._keyArray = null
        return super.clear()
    }

    /**
     * Creates an ordered array of the values of this map and caches the array internally until the map is changed
     * in some way. If you don't want caching behavior, use `[...map.values()]` or `Array.from(map.values())`.
     */
    public array(): V[] {
        if (this._array === null || this._array.length !== this.size)
            this._array = [...this.values()]
        return this._array
    }

    /**
     * Creates an ordered array of the keys of this map and caches the array internally until the map is changed
     * in some way. If you don't want caching behavior, use `[...map.keys()]` or `Array.from(map.keys())`.
     */
    public keyArray(): K[] {
        if (this._keyArray === null || this._keyArray.length !== this.size)
            this._keyArray = [...this.keys()]
        return this._keyArray
    }

    /**
     * Obtains the first value(s) in this map.
     */
    public first(): V | undefined
    public first(amount: number): V[]
    public first(amount: number = 1): V | V[] | undefined {
        const iter = this.values()
        if (amount < 0) return this.last(-amount)
        if (amount === 1) return iter.next().value
        return Array.from({ length: amount }, () => iter.next().value)
    }

    /**
     * Obtains the first key(s) in this map.
     */
    public firstKey(): K | undefined
    public firstKey(amount: number): K[]
    public firstKey(amount: number = 1): K | K[] | undefined {
        const iter = this.keys()
        if (amount < 0) return this.lastKey(-amount)
        if (amount === 1) return iter.next().value
        return Array.from({ length: amount }, () => iter.next().value)
    }

    /**
     * Obtains the last value(s) in this map.
     * Uses {@link Supermap#array} internally.
     */
    public last(): V | undefined
    public last(amount: number): V[]
    public last(amount: number = 1): V | V[] | undefined {
        const array = this.array()
        if (amount < 0) return this.first(-amount)
        if (amount === 1) return array[array.length - 1]
        return array.slice(-amount)
    }

    /**
     * Obtains the last key(s) in this map.
     * Uses {@link Supermap#keyArray} internally.
     */
    public lastKey(): K | undefined
    public lastKey(amount: number): K[]
    public lastKey(amount: number = 1): K | K[] | undefined {
        const array = this.keyArray()
        if (amount < 0) return this.firstKey(-amount)
        if (amount === 1) return array[array.length - 1]
        return array.slice(-amount)
    }

    /**
     * Obtains unique random value(s) from this map.
     * Uses {@link Supermap#array} internally.
     */
    public random(): V
    public random(amount: number): V[]
    public random(amount?: number): V | V[] | undefined {
        const array = this.array()
        if (array.length === 0)
            return typeof amount !== 'undefined' ? [] : undefined
        if (typeof amount === 'undefined') return randomOfArray(array)
        if (amount < 0) return []
        if (amount === 1) return randomOfArray(array)
        return Array.from({ length: amount }, () => randomOfArray(array))
    }

    /**
     * Obtains unique random ley(s) from this map.
     * Uses {@link Supermap#keyArray} internally.
     */
    public randomKey(): K
    public randomKey(amount: number): K[]
    public randomKey(amount?: number): K | K[] | undefined {
        const array = this.keyArray()
        if (array.length === 0)
            return typeof amount !== 'undefined' ? [] : undefined
        if (typeof amount === 'undefined') return randomOfArray(array)
        if (amount < 0) return []
        if (amount === 1) return randomOfArray(array)
        return Array.from({ length: amount }, () => randomOfArray(array))
    }

    /**
     * Searches for a single element where the given function returns a truthy value. This behaves like
     * [Array.find()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find).
     */
    public find(fn: (value: V, key: K, map: this) => boolean): V | undefined {
        for (const [key, val] of this) if (fn(val, key, this)) return val
        return undefined
    }

    /**
     * Searches for the key of a single element where the given function returns a truthy value. This behaves like
     * [Array.findIndex()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex),
     * but instead returns the key rather than the positional index.
     */
    public findKey(
        fn: (value: V, key: K, map: this) => boolean
    ): K | undefined {
        for (const [key, val] of this) if (fn(val, key, this)) return key
        return undefined
    }

    /**
     * Removes elements that satisfy the provided filter function.
     *
     * @returns The number of removed entries
     */
    public sweep(fn: (value: V, key: K, map: this) => boolean): number {
        const sizeBefore = this.size
        for (const [key, val] of this) if (fn(val, key, this)) this.delete(key)
        return sizeBefore - this.size
    }

    /**
     * Identical to [Array.filter()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter),
     * but returns a `Supermap` instead of an Array.
     */
    public filter(fn: (value: V, key: K, map: this) => boolean): this {
        const results = new Supermap<K, V>() as this
        for (const [key, val] of this)
            if (fn(val, key, this)) results.set(key, val)
        return results
    }

    /**
     * Partitions the map into two maps where the first map contains the elements that
     * passed and the second contains the elements that failed.
     */
    public partition(
        fn: (value: V, key: K, map: this) => boolean
    ): [this, this] {
        const part1 = new Supermap<K, V>() as this
        const part2 = new Supermap<K, V>() as this
        for (const [key, val] of this) {
            if (fn(val, key, this)) part1.set(key, val)
            else part2.set(key, val)
        }
        return [part1, part2]
    }

    /**
     * Maps each element to another value into a map. This behaves like
     * [Array.map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map),
     * but instead returns a `Supermap` rather than an array.
     */
    public map<T>(fn: (value: V, key: K, map: this) => T): Supermap<K, T> {
        const map = new Supermap() as Supermap<K, T>
        for (const [key, val] of this) map.set(key, fn(val, key, this))
        return map
    }

    /**
     * Checks if there exists an element that passes a test. Identical in behavior to
     * [Array.some()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some).
     */
    public some(fn: (value: V, key: K, map: this) => boolean): boolean {
        for (const [key, val] of this) if (fn(val, key, this)) return true
        return false
    }

    /**
     * Checks if all elements pass a test. Identical in behavior to
     * [Array.every()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every).
     */
    public every(fn: (value: V, key: K, map: this) => boolean): boolean {
        for (const [key, val] of this) if (!fn(val, key, this)) return false
        return true
    }

    /**
     * Continuously applies a function to produce a single value. Identical in behavior to
     * [Array.reduce()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce).
     */
    public reduce<T>(
        fn: (accumulator: T, value: V, key: K, map: this) => T,
        initial: T
    ): T {
        let result = initial
        for (const [key, val] of this) result = fn(result, val, key, this)
        return result
    }

    /**
     * Identical to [Map.forEach()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/forEach),
     * but returns the map instead of `undefined`.
     */
    public each(fn: (value: V, key: K, map: this) => void): this {
        super.forEach(fn as (value: V, key: K, map: Map<K, V>) => void)
        return this
    }

    /**
     * Identical to [Map.forEach()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/forEach),
     * but returns the map instead of `undefined`.
     */
    public forEach(fn: (value: V, key: K, map: this) => void): this {
        return this.each(fn)
    }

    /**
     * Runs a function on the map and returns the map.
     */
    public tap(fn: (map: this) => void): this {
        fn(this)
        return this
    }

    /**
     * Sorts the elements of the map in place and returns it.
     */
    public sort(
        fn: (firstValue: V, secondValue: V, firstKey: K, secondKey: K) => number
    ): this {
        const entries = [...this.entries()]
        const sorted = entries.sort((a, b): number =>
            fn(a[1], b[1], a[0], b[0])
        )
        this.clear()
        for (const [k, v] of sorted) this.set(k, v)
        return this
    }

    /**
     * Returns a new `Supermap` containing elements where the keys are present in both original maps.
     */
    public intersect(other: Supermap<K, V>): Supermap<K, V> {
        return other.filter((_, k) => this.has(k))
    }

    /**
     * Creates an identical shallow copy of this map.
     */
    public clone(): this {
        return new this.constructor[Symbol.species](this) as this
    }

    /**
     * Combines this map with others into a new `Supermap`. None of the source maps are modified.
     */
    public concat(...maps: Supermap<K, V>[]): this {
        const newMap = this.clone()
        for (const map of maps)
            for (const [key, val] of map) newMap.set(key, val)
        return newMap
    }

    /**
     * Checks if this map shares identical elements with another.
     */
    public equals(map: Supermap<K, V>): boolean {
        if (this === map) return true
        if (this.size !== map.size) return false
        for (const [key, value] of this) {
            if (!map.has(key) || value !== map.get(key)) {
                return false
            }
        }
        return true
    }
}

function randomOfArray<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)]
}
