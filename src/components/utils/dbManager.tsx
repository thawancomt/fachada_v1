import { DEFAULT_STATE, SegmentState, VALID_STATES } from "../Segment";

interface FacadeOptions {
    facadeName: string;
    rows: number;
    columns: number;
    reverseIndex?: boolean;
    inverseY?: boolean;
    inverseX?: boolean;
    onlyNumbersIndex?: boolean;
    states?: { [x: number]: { [y: number]: SegmentState } };
    notes?: { [x: number]: { [y: number]: string } };
    area?: { [x: number]: { [y: number]: { width: number, height: number } } };

}

class ORM {
    constructor() {
    }

    // Read the full map of facades (or return empty object)
    private getAllFacades(): Record<string, FacadeOptions> {
        const raw = window.localStorage.getItem("facades");
        if (!raw) return {};

        try {
            return JSON.parse(raw) as Record<string, FacadeOptions>;
        } catch {
            console.warn("Invalid facades in localStorage, resetting.");
            return {};
        }
    }

    // Get a single facade by name
    getFacade(facadeName: string): FacadeOptions | null {
        const all = this.getAllFacades();
        return all[facadeName] || null;
    }

    // Set or update a facade without losing the rest
    setNewFacade(options: FacadeOptions) {

        if (this.checkIfFacadeExists(options.facadeName)) {
            if (!window.confirm("Uma fachada com esse nome já existe. Deseja sobrescrever?")) {
                return false;
            }
        }

        const all = this.getAllFacades();

        all[options.facadeName] = options;

        window.localStorage.setItem("facades", JSON.stringify(all));

        return true;

    }

    updateFacade(facadeName: string, options: Partial<FacadeOptions>) {
        const all = this.getAllFacades();
        const facade = this.getFacade(facadeName);

        if (!facade) {
            console.error("Facade does not exist: ", facadeName);
            return false;
        }

        all[facadeName] = { ...facade, ...options };
        window.localStorage.setItem("facades", JSON.stringify(all));
        return true;
    }

    checkIfFacadeExists(facadeName: string): boolean {
        const all = this.getAllFacades();
        return all[facadeName] !== undefined;
    }

    deleteFacade(facadeName: string) {

        if (!this.checkIfFacadeExists(facadeName)) {
            console.error("Facade does not exist: ", facadeName);
            return false;
        }

        const all = this.getAllFacades();
        delete all[facadeName];
        window.localStorage.setItem("facades", JSON.stringify(all));
        return true;
    }

    setSegmentState(facadeName: string, segmentIndex: { x: number; y: number }, state: SegmentState) {



        if (state && !VALID_STATES.includes(state)) {
            console.error("Invalid state: ", state, " for segment: ", segmentIndex, " in facade: ", facadeName);
            return false;
        }

        if (!this.checkIfFacadeExists(facadeName)) {
            console.error("Facade does not exist: ", facadeName);
            return false;
        }

        const all = this.getAllFacades();

        const facade = all[facadeName];

        if (facade.states) {
            if (facade.states[segmentIndex.x]) {
                facade.states[segmentIndex.x][segmentIndex.y] = state || DEFAULT_STATE;
            } else {
                facade.states[segmentIndex.x] = { [segmentIndex.y]: state || DEFAULT_STATE };
            }

        } else {
            facade.states = { [segmentIndex.x]: { [segmentIndex.y]: state } };
        }



        all[facadeName] = facade;
        window.localStorage.setItem("facades", JSON.stringify(all));
        return true;

    }

    setSegmentNote(facadeName: string, segmentIndex: { x: number; y: number }, note: string) {

        if (!this.checkIfFacadeExists(facadeName)) {
            console.error("Facade does not exist: ", facadeName);
            return false;
        }

        const all = this.getAllFacades();

        const facade = all[facadeName];

        if (facade.notes) {
            if (facade.notes[segmentIndex.x]) {
                facade.notes[segmentIndex.x][segmentIndex.y] = note || "";
            } else {
                facade.notes[segmentIndex.x] = { [segmentIndex.y]: note || "" };
            }

        } else {
            facade.notes = { [segmentIndex.x]: { [segmentIndex.y]: note || "" } };
        }

        all[facadeName] = facade;
        window.localStorage.setItem("facades", JSON.stringify(all));
        return true;
    }

    setSegmentArea(facadeName: string, segmentIndex: { x: number; y: number }, { width, height }: { width: number, height: number }) {
        if (!this.checkIfFacadeExists(facadeName)) {
            console.error("Facade does not exist: ", facadeName);
            return false;
        }

        const all = this.getAllFacades();

        const facade = all[facadeName];

        if (facade.area) {

            if (facade.area[segmentIndex.x]) {
                facade.area[segmentIndex.x][segmentIndex.y] = { width, height };
            }
            else {
                facade.area[segmentIndex.x] = { [segmentIndex.y]: { width, height } };
            }
        } else {
            facade.area = { [segmentIndex.x]: { [segmentIndex.y]: { width, height } } };
        }


        all[facadeName] = facade;
        window.localStorage.setItem("facades", JSON.stringify(all));
        return true;

    }

    getSegmentState(facadeName: string, segmentIndex: { x: number, y: number }): SegmentState | null {
        const all = this.getAllFacades();
        const facade = all[facadeName];

        if (!facade) {
            console.error("Facade does not exist: ", facadeName);
            return null;
        }

        if (!facade.states) {
            console.warn("No states found for facade: ", facadeName);
            return null;
        }

        return facade.states[segmentIndex.x][segmentIndex.y] || null;
    }

    getSegmentNote(facadeName: string, segmentIndex: { x: number, y: number }): string | null {
        const all = this.getAllFacades();
        const facade = all[facadeName];

        if (!facade) {
            console.error("Facade does not exist: ", facadeName);
            return null;
        }

        if (!facade.notes) {
            console.warn("No notes found for facade: ", facadeName);
            return null;
        }

        return facade.notes[segmentIndex.x][segmentIndex.y] || null;
    }

    getSegmentArea(facadeName: string, segmentIndex: { x : number, y : number})  : { width: number, height: number } | null {
        const facade = this.getFacade(facadeName);

        if (!facade) {
            console.error("Facade does not exist: ", facadeName);
            return null;
        }

        if (!facade.area) {
            console.warn("No area found for facade: ", facadeName);
            return null;
        }

        if (!facade.area[segmentIndex.x]) {
            console.warn("No area found for segment: ", segmentIndex, " in facade: ", facadeName);
            return null;
        }

        if (!facade.area[segmentIndex.x][segmentIndex.y]) {
            console.warn("No area found for segment: ", segmentIndex, " in facade: ", facadeName);
            return null;
        }
        
        return facade.area[segmentIndex.x][segmentIndex.y] || null;

    }

}

export const dbManager = new ORM();
export type { FacadeOptions }
