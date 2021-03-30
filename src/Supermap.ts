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
}
