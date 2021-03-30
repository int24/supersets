export interface SupermapConstructor {
    new (): Superset<unknown>
    new <V>(entries?: ReadonlyArray<V> | null): Superset<V>
    new <V>(iterable: Iterable<V>): Superset<V>
    readonly prototype: Superset<unknown>
    readonly [Symbol.species]: SupermapConstructor
}

/**
 * An abstraction of useful methods over a JavaScript `Set`.
 *
 * @property {number} size - The amount of elements in this set.
 */
export class Superset<V> extends Set<V> {
    private _array: V[] | null = null

    public ['constructor']: typeof Superset

    constructor(entries?: ReadonlyArray<V> | null) {
        super(entries)
    }

    /**
     * Identical to [Set.add()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/add).
     * Sets a new element in the add with the specified value.
     */
    public add(value: V): this {
        this._array = null
        return super.add(value)
    }

    /**
     * Identical to [Set.delete()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/delete).
     * Deletes an element from the set.
     *
     * @returns `true` if the element was removed, `false` if the element does not exist.
     */
    public delete(value: V): boolean {
        this._array = null
        return super.delete(value)
    }

    /**
     * Identical to [Set.has()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/has).
     * Checks if an element exists in the set.
     *
     * @returns `true` if the element exists, `false` if it does not exist.
     */
    public has(value: V): boolean {
        return super.has(value)
    }

    /**
     * Identical to [Set.clear()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/clear).
     * Removes all elements from the set.
     */
    public clear(): void {
        this._array = null
        return super.clear()
    }

    /**
     * Creates an ordered array of the values of this set and caches the array internally until the set is changed
     * in some way. If you don't want caching behavior, use `[...set.values()]` or `Array.from(set.values())`.
     */
    public array(): V[] {
        if (this._array === null || this._array.length !== this.size)
            this._array = [...this.values()]
        return this._array
    }

    /**
     * Obtains the first value(s) in this set.
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
     * Obtains the last value(s) in this set.
     * Uses {@link Superset#array} internally.
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
     * Obtains unique random value(s) from this map.
     * Uses {@link Superset#array} internally.
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
     * Searches for a single element where the given function returns a truthy value.
     */
    public find(fn: (value: V, set: this) => boolean): V | undefined {
        for (const val of this) if (fn(val, this)) return val
        return undefined
    }

    /**
     * Removes elements that satisfy the provided filter function.
     *
     * @returns The number of removed entries
     */
    public sweep(fn: (value: V, set: this) => boolean): number {
        const sizeBefore = this.size
        for (const val of this) if (fn(val, this)) this.delete(val)
        return sizeBefore - this.size
    }

    /**
     * Returns elements that satisfy the provided filter function.
     */
    public filter(fn: (value: V, set: this) => boolean): this {
        const results = new Superset<V>() as this
        for (const val of this) if (fn(val, this)) results.add(val)
        return results
    }

    /**
     * Partitions the set into two sets where the first set contains the elements that
     * passed and the second contains the elements that failed.
     */
    public partition(fn: (value: V, set: this) => boolean): [this, this] {
        const part1 = new Superset<V>() as this
        const part2 = new Superset<V>() as this
        for (const val of this) {
            if (fn(val, this)) part1.add(val)
            else part2.add(val)
        }
        return [part1, part2]
    }

    /**
     * Maps each element to another value into a set.
     */
    public map<T>(fn: (value: V, set: this) => T): Superset<T> {
        const set = new Superset() as Superset<T>
        for (const val of this) set.add(fn(val, this))
        return set
    }

    /**
     * Checks if there exists an element that passes a test.
     */
    public some(fn: (value: V, set: this) => boolean): boolean {
        for (const val of this) if (fn(val, this)) return true
        return false
    }

    /**
     * Checks if all elements pass a test.
     */
    public every(fn: (value: V, set: this) => boolean): boolean {
        for (const val of this) if (!fn(val, this)) return false
        return true
    }

    /**
     * Continuously applies a function to produce a single value.
     */
    public reduce<T>(
        fn: (accumulator: T, value: V, set: this) => T,
        initial: T
    ): T {
        let result = initial
        for (const val of this) result = fn(result, val, this)
        return result
    }

    /**
     * Runs a function on each element of the set and returns the set.
     */
    public each(fn: (value: V, set: this) => void): this {
        super.forEach(v => fn(v, this))
        return this
    }

    /**
     * Runs a function on the set and returns the set.
     */
    public tap(fn: (set: this) => void): this {
        fn(this)
        return this
    }

    /**
     * Sorts the elements of the set in place and returns it.
     */
    public sort(fn: (firstValue: V, secondValue: V) => number): this {
        const entries = [...this.entries()]
        const sorted = entries.sort((a, b): number => fn(a[0], b[0]))
        this.clear()
        for (const [v] of sorted) this.add(v)
        return this
    }

    /**
     * Returns a new `Superset` containing elements where the keys are present in both original sets.
     */
    public intersect(other: Superset<V>): Superset<V> {
        return other.filter(v => this.has(v))
    }

    /**
     * Creates an identical shallow copy of this sets.
     */
    public clone(): this {
        return new this.constructor[Symbol.species](this) as this
    }

    /**
     * Combines this set with others into a new `Superset`. None of the source set are modified.
     */
    public concat(...sets: Superset<V>[]): this {
        const newMap = this.clone()
        for (const set of sets) for (const val of set) newMap.add(val)
        return newMap
    }

    /**
     * Checks if this set shares identical elements with another.
     */
    public equals(set: Superset<V>): boolean {
        if (this === set) return true
        if (this.size !== set.size) return false
        for (const value of this) {
            if (!set.has(value)) {
                return false
            }
        }
        return true
    }
}

function randomOfArray<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)]
}
