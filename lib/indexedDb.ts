import Dexie, { Table } from 'dexie';

export interface Seed {
    id: string;             // required if using as primary key
    value: Buffer<ArrayBufferLike>;
}

export class DB extends Dexie {
    seeds!: Table<Seed>;

    constructor() {
        super('myDatabase');
        this.version(1).stores({
            seeds: 'id, value'   // use your own id; no auto-increment
        });
    }
}

export const db = new DB();
