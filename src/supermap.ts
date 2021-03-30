export interface SupermapConstructor {
    new (): Supermap<unknown, unknown>
    new <K, V>(entries?: ReadonlyArray<readonly [K, V]> | null): Supermap<K, V>
    new <K, V>(iterable: Iterable<readonly [K, V]>): Supermap<K, V>
    readonly prototype: Supermap<unknown, unknown>
    readonly [Symbol.species]: SupermapConstructor
}

export class Supermap<K, V> extends Map<K, V> {
    private _array: V[] | null = null
    private _keyArray: K[] | null = null

    public ['constructor']: typeof Supermap

    constructor(entries?: ReadonlyArray<readonly [K, V]> | null) {
        super(entries)
    }

    public get(key: K): V | undefined {
        return super.get(key)
    }

    public set(key: K, value: V): this {
        this._array = null
        this._keyArray = null
        return super.set(key, value)
    }

    public delete(key: K): boolean {
        this._array = null
        this._keyArray = null
        return super.delete(key)
    }

    public has(key: K): boolean {
        return super.has(key)
    }

    public clear(): void {
        this._array = null
        this._keyArray = null
        return super.clear()
    }

    public array(): V[] {
        if (this._array === null || this._array.length !== this.size)
            this._array = [...this.values()]
        return this._array
    }

    public keyArray(): K[] {
        if (this._keyArray === null || this._keyArray.length !== this.size)
            this._keyArray = [...this.keys()]
        return this._keyArray
    }

    public first(): V | undefined
    public first(amount: number): V[]
    public first(amount: number = 1): V | V[] | undefined {
        const iter = this.values()
        if (amount < 0) return this.last(-amount)
        if (amount === 1) return iter.next().value
        return Array.from({ length: amount }, () => iter.next().value)
    }

    public firstKey(): K | undefined
    public firstKey(amount: number): K[]
    public firstKey(amount: number = 1): K | K[] | undefined {
        const iter = this.keys()
        if (amount < 0) return this.lastKey(-amount)
        if (amount === 1) return iter.next().value
        return Array.from({ length: amount }, () => iter.next().value)
    }

    public last(): V | undefined
    public last(amount: number): V[]
    public last(amount: number = 1): V | V[] | undefined {
        const array = this.array()
        if (amount < 0) return this.first(-amount)
        if (amount === 1) return array[array.length - 1]
        return array.slice(-amount)
    }

    public lastKey(): K | undefined
    public lastKey(amount: number): K[]
    public lastKey(amount: number = 1): K | K[] | undefined {
        const array = this.keyArray()
        if (amount < 0) return this.firstKey(-amount)
        if (amount === 1) return array[array.length - 1]
        return array.slice(-amount)
    }

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

    public find(fn: (value: V, key: K, c: this) => boolean): V | undefined {
        for (const [key, val] of this) if (fn(val, key, this)) return val
        return undefined
    }

    public findKey(fn: (value: V, key: K, c: this) => boolean): K | undefined {
        for (const [key, val] of this) if (fn(val, key, this)) return key
        return undefined
    }

    public sweep(fn: (value: V, key: K, c: this) => boolean): number {
        const sizeBefore = this.size
        for (const [key, val] of this) if (fn(val, key, this)) this.delete(key)
        return sizeBefore - this.size
    }

    public filter(fn: (value: V, key: K, c: this) => boolean): this {
        const results = new Supermap<K, V>() as this
        for (const [key, val] of this)
            if (fn(val, key, this)) results.set(key, val)
        return results
    }

    public partition(fn: (value: V, key: K, c: this) => boolean): [this, this] {
        const part1 = new Supermap<K, V>() as this
        const part2 = new Supermap<K, V>() as this
        for (const [key, val] of this) {
            if (fn(val, key, this)) part1.set(key, val)
            else part2.set(key, val)
        }
        return [part1, part2]
    }

    public map<T>(fn: (value: V, key: K, c: this) => T): Supermap<K, T> {
        const map = new Supermap() as Supermap<K, T>
        for (const [key, val] of this) map.set(key, fn(val, key, this))
        return map
    }

    public some(fn: (value: V, key: K, c: this) => boolean): boolean {
        for (const [key, val] of this) if (fn(val, key, this)) return true
        return false
    }

    public every(fn: (value: V, key: K, c: this) => boolean): boolean {
        for (const [key, val] of this) if (!fn(val, key, this)) return false
        return true
    }

    public reduce<T>(
        fn: (accumulator: T, value: V, key: K, c: this) => T,
        initial: T
    ): T {
        let result = initial
        for (const [key, val] of this) result = fn(result, val, key, this)
        return result
    }

    public each(fn: (value: V, key: K, c: this) => void): this {
        super.forEach(fn as (value: V, key: K, map: Map<K, V>) => void)
        return this
    }

    public forEach(fn: (value: V, key: K, c: this) => void): this {
        return this.each(fn)
    }

    public tap(fn: (c: this) => void): this {
        fn(this)
        return this
    }

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

    public intersect(other: Supermap<K, V>): Supermap<K, V> {
        return other.filter((_, k) => this.has(k))
    }

    public clone(): this {
        return new this.constructor[Symbol.species](this) as this
    }

    public concat(...maps: Supermap<K, V>[]): this {
        const newMap = this.clone()
        for (const map of maps)
            for (const [key, val] of map) newMap.set(key, val)
        return newMap
    }

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
