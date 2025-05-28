import { openDB } from 'idb';
import VALID_STATES, { VALID_STATES_OBJECT } from '../STATES/States';
import { GridOptions } from '../context/GridContext';

export type FacadeData = {
    id: number;
    name: string;
    grid: GridOptions;
    createdAt: Date;
    updatedAt: Date;
}

export type SegmentData = {
    facadeName: string;
    facadeId: number;

    index: { x: number; y: number };
    state: VALID_STATES;
    dimension: { width: number; height: number };
    note: string;

}



const dbPromisse = openDB('facade-db', 1, {
    upgrade(db) {
        db.createObjectStore('facades', {
            keyPath: 'id',
            autoIncrement: true
        });
    }
});

function ensureGridCellExists(facade: any, params: SegmentData) {
    if (!facade.grid[params.index.x]) {
        facade.grid[params.index.x] = {};
    }

    if (!facade.grid[params.index.x][params.index.y]) {
        facade.grid[params.index.x][params.index.y] = {};
    }
}

export async function saveFacade(params: FacadeData) {
    const db = await dbPromisse;
    await db.put('facades', params);
}

export async function getFacade(id: string): Promise<FacadeData | undefined> {
    const db = await dbPromisse;
    return db.get('facades', id);
}

export async function getAllFacades() {
    const db = await dbPromisse;
    return db.getAll('facades');
}

export async function deleteFacade(id: string): Promise<void> {
    const db = await dbPromisse;
    await db.delete('facades', id);
}

export async function updateSegment(params: SegmentData): Promise<void | null> {
    const db = await dbPromisse;
    const facade = await db.get('facades', params.facadeId);

    console.log(`Updating segment ${params.index} with params`, params);
    

    if (!params.state) return null;

    ensureGridCellExists(facade, params);

    if (params.state) facade.grid[params.index.x][params.index.y].state = params.state;
    if (params.dimension) facade.grid[params.index.x][params.index.y].dimension = params.dimension;
    if (params.note) facade.grid[params.index.x][params.index.y].note = params.note;

    await db.put('facades', facade);

}

export async function getSegmentData(facadeId: number, index: { x: number; y: number }): Promise<SegmentData | null> {
    const db = await dbPromisse;

    console.log(`Fetching segment data for facadeId: ${facadeId}, index: ${JSON.stringify(index)}`);
    

    const facade = await db.get('facades', facadeId);

    if (!facade || !facade.grid || !facade.grid[index.x] || !facade.grid[index.x][index.y]) {
        return null;
    }

    const segment = facade.grid[index.x][index.y];

    return {
        facadeName: facade.name,
        facadeId: facadeId,
        index: index,
        state: segment.state,
        dimension: segment.dimension,
        note: segment.note
    };
}

