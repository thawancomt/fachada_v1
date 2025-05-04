interface FacadeOptions {
    facadeName: string;
    rows: number;
    columns: number;
    reverseIndex?: boolean;
    inverseY?: boolean;
    inverseX?: boolean;
    onlyNumbersIndex?: boolean;
}

class ORM {
    constructor() {
        // Initialize the ORM
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
        const all = this.getAllFacades();

        all[options.facadeName] = options;

        window.localStorage.setItem("facades", JSON.stringify(all));

        if (this.checkIfFacadeExists(options.facadeName)) {
            return true;
        } else {
            console.error("Failed to set new facade: ", options.facadeName);
            return false;
        }

    }

    checkIfFacadeExists(facadeName: string) : boolean {
        const all = this.getAllFacades();
        return all[facadeName] !== undefined;
    }
}

export const dbManager = new ORM();
