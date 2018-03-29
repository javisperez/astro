export default
class Collection {
    /**
     * Initialize the class instance
     *
     * @param {Array} array - Initializing array
     */
    constructor(array = []) {
        this.items = new Set(array);
    }

    /**
     * Add an item to the collection
     *
     * @param {*} item - Item to add
     * @memberof Collection
     */
    add(item) {
        this.items.add(item);
    }

    /**
     * Get all the items
     *
     * @memberof Collection
     * @return Set
     */
    all() {
        return this.items;
    }

    /**
     * Foreach
     *
     * @param {Function} fn - A callback function to validate
     * @memberof Collection
     * @return Collection
     */
    forEach(fn) {
        return this.items.forEach(fn);
    }

    /**
     * File the collection
     *
     * @param {Function} fn - A function to validate the filter
     * @memberof Collection
     * @return Collection
     */
    filter(fn) {
        if (!fn) {
            return this.all();
        }

        const filtered = new Collection();

        this.forEach(item => {
            if (fn(item)) {
                filtered.add(item);
            }
        });

        return filtered;
    }

    /**
     * Map method
     *
     * @param {Function} fn - The validation function
     * @return Collection
     */
    map(fn) {
        if (!fn) {
            return this.all();
        }

        const mapped = new Collection();

        this.forEach(item => {
            mapped.add(fn(item));
        });

        return mapped;
    }

    sortBy(property) {
        if (!property) {
            return this.all();
        }

        return this.sort((a, b) => {
            if (a[property] < b[property]) {
                return -1;
            }

            if (a[property] > b[property]) {
                return 1;
            }

            return 0;
        });
    }

    sort(fn = null) {
        if (!fn) {
            return this.all();
        }

        const items = this.toArray();
        items.sort(fn);

        const sorted = new Collection(items);
        return sorted;
    }

    /**
     * Convert the collection to an Array
     * @return Array
    */
    toArray() {
        return Array.from(this.items);
    }

    /**
     * Length of the set
     */
    get length() {
        return this.items.size;
    }
}
