export interface SupermapConstructor {
    new (): Supermap<unknown, unknown>
    new <K, V>(entries?: ReadonlyArray<readonly [K, V]> | null): Supermap<K, V>
    new <K, V>(iterable: Iterable<readonly [K, V]>): Supermap<K, V>
    readonly prototype: Supermap<unknown, unknown>
    readonly [Symbol.species]: SupermapConstructor
}

export class Supermap<K, V> extends Map<K, V> {
    constructor(entries?: ReadonlyArray<readonly [K, V]> | null) {
        super(entries)
    }

    public get(key: K): V | undefined {
        return super.get(key)
    }

    public set(key: K, value: V): this {
        return super.set(key, value)
    }

    public has(key: K): boolean {
        return super.has(key)
    }

    public delete(key: K): boolean {
        return super.delete(key)
    }

    public clear(): void {
        return super.clear()
    }
}
