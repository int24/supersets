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
}

function randomOfArray<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)]
}
