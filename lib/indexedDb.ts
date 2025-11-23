import Dexie, { Table } from 'dexie';
import { Seed } from './type';

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
